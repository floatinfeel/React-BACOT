const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const PORT = process.env.PORT || 5000
const router = require('./router')
const cors = require('cors');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users')

const app = express()
const server = http.createServer(app)
const io = socketio(server);

app.use(router)
app.use(cors())

io.on('connection', (socket)=>{

    //listener from socket io client for 'join event'
    socket.on('join', ({name, room}, callback)=>{
      const {error, user} = addUser({id: socket.id, name, room})

      if(error){
        return callback(error)
      }
      socket.join(user.room)

      //welcome message to new user that join room
      socket.emit('message', {user: 'admin', text: `${user.name} welcome to the room ${user.room}`})
      //to broadcast message for all user in room that new user has join
      socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has join the room`})
      
     

      io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

      callback()
    })

    //listener for user who send message
    socket.on('sendMessage', (message, callback)=>{
      const user = getUser(socket.id)
      console.log(`>>>>>>>>>>> ${user}`);
      io.to(user.room).emit('message', {user: user.name, text: message})
      // 
      callback()

    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
          io.to().emit('message', {user:'admin', text: `${user.name} has left`})
          io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
        }
    })
})




server.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
})

