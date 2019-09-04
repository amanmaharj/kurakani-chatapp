const users=[]

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username||!room){
        return {
            error: 'Username and Room are required'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    //validate the username
    if(existingUser){
        return{
            error: 'Username has already been taken'
        }
    }
    //store the user
    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
   const index= users.findIndex((user)=>{
        return user.id===id     
    })
    if (index !== -1){
       return users.splice(index, 1)[0]
    }
}




const getUserInRoom=(room)=>{
const userInRoom=users.filter((user)=>{
    return user.room===room
})
return userInRoom
}



const getUser=(id)=>{
    const userget=users.find((user)=>{
        return user.id===id
    })
    return userget
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
