const express = require('express')
const http = require('http')
const PORT = process.env.PORT || 5000
const router = require('./router')
const cors = require('cors');

const {addUser, removeUser, getUser, getUserInRoom, getUsersInRomm} = require('./users')

const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')

const io = socketio(server, {
  cors: {
    origin: '*',
  }
});
// app.use(cors())

io.on('connect', (socket)=>{

    //listener from socket io client for 'join event'
    socket.on('join', ({name, room}, callback)=>{
      const {error, user} = addUser({id: socket.id, name, room})

      if(error){
        callback(error)
      }

      //welcome message to new user that join room
      socket.emit('message', {user: 'admin', text: `${user.name} welcome to the room ${user.room}`})
      //to broadcast message for all user in room that new user has join
      socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has join the room`})
      
      socket.join(user.room)

      io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)})

      callback()
    })

    //listener for user who send message
    socket.on('sendMessage', (message, callback)=>{
      const user = getUser(socket.id)
      io.to(user.room).emit('message', {user: user.name, text: message})
      io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)})
      callback()

    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
          io.to().emit('message', {user:'admin', text: `${user.name} has left`})
        }
    })
})

app.use(router)

server.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
})

