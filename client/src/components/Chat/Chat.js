import React, {useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import './Chat.css'
let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMassage] = useState('')
    const [messages, setMassages] = useState([])
    const ENDPOINT = 'localhost:5000'

    //handling join
    useEffect(() =>{
        const {name, room} = queryString.parse(location.search)
        setName(name)
        setRoom(room)

        socket = io(ENDPOINT)


        socket.emit('join', {name, room}, (error)=>{
           if(error){
               alert(error)
           }
        })

        //component will unmount for disconnecting emit join / user left chat
        
        return ()=>{
            socket.emit('disconnect')
            socket.off()
        }

    }, [ENDPOINT, location.search])

    //handling chat
    useEffect(() =>{
        socket.on('message', (message)=>{
            setMassages([...messages, message])
        })
    },[messages])

    //function for sending message
    const sendMessage = (event) =>{
        event.preventDefault()
        if(message){
            socket.emit('sendMessage', message, ()=>{
                setMassage('')
            })
        }
    }

    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container"> 
                
                <InfoBar 
                    room={room}/>
                <Messages 
                    messages={messages}
                    name={name} />
                <Input
                    message={message}
                    setMessage={setMassage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}

export default Chat
