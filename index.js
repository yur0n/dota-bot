const express = require('express')
require('./bot.js')


const app = express()
const port = process.env.PORT || 3000



app.get('', async (req, res) => {
    res.send("Hello, I'm a Dota bot")
})




app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})