const timeAndMessageGenerate=(username,text)=>{
    return{
        username,
        text,
        createdAt: new Date().getTime()
    }
     
}
const timeAndLocationGenerate=(username,url)=>{
    return{
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports={
    timeAndMessageGenerate,
    timeAndLocationGenerate
}