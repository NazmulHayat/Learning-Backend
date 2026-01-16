import express from 'express'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// User Registration
router.post('/register', (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    console.log(hashedPassword)
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, "Your first todo!")

        //create a token for active session
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
    }
})

router.post('/login', (req, res) => {

    const { username, password } = req.body

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)

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
