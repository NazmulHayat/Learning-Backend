const express = require("express")
const app = express()
const PORT = 8383

data = ["nazmul", "hasan", "nadim", "hayat"]

// website endpoints
app.use(express.json())
app.get('/', (req, res) => {
    res.send(
        `
        <body style="background:pink;">
            <h1 style="color:purple;">Welcome to my website!</h1>
            <a href="/dashboard" style="color:blue;">Go to Dashboard</a>
        </body>
        `
    )
})
app.get('/dashboard', (req, res) => {
    console.log("User has entered dashboard")
    res.send('This is the dashboard page')
})

// api endpoints

app.get('/api/data', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    console.log("User has entered /api/data endpoint")
    res.write("Helloooooo\n")
    await new Promise(resolve => setTimeout(resolve, 5000))
    res.write("Helloooooo after 5 seconds")
    res.end()
})

// CRUD

app.post('/api/data', (req, res) => {
    const newEntry = req.body
    console.log("Received new entry:", newEntry)
    if (newEntry.name != null) {
        data.push(newEntry.name)
    }
    res.json({
        success: true,
        received: newEntry,
    })
    console.log("current data:", data)
})


app.delete('/api/data', (req, res) => {
    data.pop()
    res.json({
        success: true,
        data: data,
    })
    console.log("current data:", data)
})

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))




