const users = []

const addUser = ({id, username, room}) => {

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'username is in use!'
        }
    }

    //store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    //find user: -1 if no match 0 or grather if match with the proper index
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        //return the user we removed
        return users.splice(index, 1)[0]
    }
    // return {
    //     error: 'user not found!'
    // }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom  
}