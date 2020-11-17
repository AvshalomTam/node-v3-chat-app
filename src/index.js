const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const {generateMessage, generateLocationMessage} = require('./utils/messaages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    // server sends data to client by emit function that runs on client side js on chat.js file
    socket.emit('message', generateMessage("Welcome"))
    // server activate messege event at the clients (accept the one that newly connected=broadcast)
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    // server listen to sendMessage event
    socket.on('sendMessage', (message, callback) => {
        // check for Profanity in message before it is being sent to all clients
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        // server activate messege event at the clients
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (position, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has disconnected!'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})