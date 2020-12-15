const users = []

const addUser = ({id, name, room}) =>{
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.name === name && user.room === room )

    if(existingUser){
        return {error: 'username has taken!'}
    }

    const user = {id, name, room}

    users.push(user)
    return {user}
}

const removeUser = (id) =>{
    const leftUser = users.findIndex((user) => user.id === id)

    if(leftUser !== -1){
        return users.splice(leftUser, 1)[0]
    }

}

const getUser = (id) =>{
    users.find((user)=> user.id === id)
}

const getUsersInRomm = (room) =>{
    users.filter((user)=> user.romm === room)

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRomm
}