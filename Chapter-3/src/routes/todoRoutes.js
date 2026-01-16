import express from 'express';
const router = express.Router();

import db from '../db.js';

// fetch
router.get('/', (req, res) => {
    const getTodos = db.prepare(`SELECT * from todos WHERE user_id = ?`)
    const Todos = getTodos.all(req.userId)
    res.json(Todos)
})

// add
router.post('/', (req, res) => {
    const { task } = req.body
    console.log("inside post request from todo bro")
    const postTodos = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    const result = postTodos.run(req.userId, task)

    res.json({ id: result.lastInsertRowid, task, completed: 0 })
    console.log("done adding bro ")
})

// replace todo
router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    updatedTodo.run(completed, id)

    res.json({ messgae: "Todo completed" })
})

// delete
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
    deleteTodo.run(id, req.userId)
    res.json({ message: "Deleteed bvro" })
})

export default router;
