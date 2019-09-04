const path=require('path')
const http=require('http')
const express=require('express')
//const Filter=require('bad-words')
const {timeAndMessageGenerate,timeAndLocationGenerate}=require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom}=require('./utils/user')
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)

//to explicitly support the websocket we had to make a server otherwise express would have done than behind the scene
const io=socketio(server)

const port=process.env.PORT||3000
const publicPath=path.join(__dirname,'../public')

app.use(express.static(publicPath))


io.on('connection',(socket)=>{
    console.log('new web socket connection')
   
    socket.on('join',({username,room}, callback)=>{
        const {error,user}=addUser({id: socket.id, username, room})

        if(error){
         return  callback(error)
        }

        socket.join(user.room)

        socket.emit('message',timeAndMessageGenerate('KURAKANI','Welcome!!!'))
        socket.broadcast.to(user.room).emit('message',timeAndMessageGenerate('KURAKANI',`${user.username} has joined!`))

        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback()
    })
    
    socket.on('sendMessage',(message,callback)=>{
        
        // const filter=new Filter()
        // if(filter.isProfane(message)){
        //     return callback('profane words are not allowed')
        // }
      const user= getUser(socket.id)
        io.to(user.room).emit('message',timeAndMessageGenerate(user.username,message))
        callback('message delivered')
    })

    

    socket.on('disconnect',()=>{
       const user= removeUser(socket.id)
       if(user){
            io.to(user.room).emit('message',timeAndMessageGenerate('KURAKANI',`${user.username} has left the room`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
       }
        
    })
    
    socket.on('sendLocation',(currentPosition,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',timeAndLocationGenerate(user.username,`https://google.com/maps?q=${currentPosition.latitude},${currentPosition.longitude}`))
        callback()
    })

    
})



server.listen(port,()=>{
    console.log(`listening starting on ${port}`)
})