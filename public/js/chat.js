const socket=io()
//elements of the page
const $messageForm=document.querySelector('#myForm')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')

const $button=document.querySelector('#send-location')

const $messages=document.querySelector('#messages')

//templates

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options for query string for defining chat room
const {username, room}=Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll=()=>{
    //new message element
    const $newMessage=$messages.lastElementChild

    //height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    
    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight= $messages.scrollHeight

    //how far have i scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight - newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('LT')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    console.log(room)
    console.log(users)
    const html=Mustache.render(sidebarTemplate,{
            room,
            users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit',(e)=>{


    //stop you to refresh whole page
    e.preventDefault()

    //disable the send button
    $messageFormButton.setAttribute('disabled', 'disabled')

    //e.target gives access you to the form and elements.message gives access to the name 'message'
    const message=e.target.elements.messages.value

    // socket.emit('sendMessage',message,(error)=>{
    //  if(error){
    //     return console.log(error)
    //  }
    //     console.log("delivered")
    // }) 

    socket.emit('sendMessage',message,(message)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

        console.log(message)
    })
})



$button.addEventListener('click',()=>{
     if(!navigator.geolocation){
       return  alert('Your browser do not support the Geolocation feature')
     }
     navigator.geolocation.getCurrentPosition((position)=>{
        $button.setAttribute('disabled','disabled')
        const currentPosition={
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }
        socket.emit('sendLocation',currentPosition,()=>{
           $button.removeAttribute('disabled')
            console.log('Location shared')
        })
      


     })
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        username:url.username ,
        url: url.url,
        createdAt: moment(url.createdAt).format('LT')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
