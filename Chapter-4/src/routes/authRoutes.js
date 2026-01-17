import express from 'express'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

// User Registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    console.log(hashedPassword)
    try {
        const user = await prisma.user.create({
            data: {
                username, password: hashedPassword
            }
        })

        await prisma.todo.create({
            data: {
                userId: user.id,
                title: "Your first todo!"
            }
        })

        //create a token for active session
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
    }
})

router.post('/login', (req, res) => {

    const { username, password } = req.body

    try {
        const user = prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }

        const passwordCheck = bcrypt.compareSync(password, user.password)
        if (!passwordCheck) {
            return res.status(401).send({ message: "Invalid password bro " })
        }
        console.log("You made it bro: ", user)

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
        // then we have a final successful login

    } catch (err) {
        console.log(err.message)
        res.status(503) //internal srvr issue
    }

})




export default router
