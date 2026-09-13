const express = require('express')

const app = express()

app.get('/home',(req,res)=>{
    res.send('Welcome to nodejs application')
})

app.get('/about',(req,res)=>{
    res.send('Welcome to about page')
})

app.listen(3000,()=>{
    console.log("Server is running...")
})