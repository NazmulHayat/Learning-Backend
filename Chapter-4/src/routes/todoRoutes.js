import express from 'express';
const router = express.Router();

// fetch
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })

    res.json(todos)
})

// add
router.post('/', async (req, res) => {
    const { task } = req.body
    console.log("inside post request from todo bro")

    const todo = await prisma.todo.create({
        data: {
            task, userId: req.userId
        }
    })

    res.json(todo)
    console.log("done adding bro ")
})

// replace todo
router.put('/:id', async (req, res) => {
    const { completed } = req.body
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = await prisma.todo.update({
        where: {
            iid: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo)
})

// delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
    })

    res.send({ message: "Todo Deleted" })
})


export default router;
