const express = require('express')
const handlebars = require('express-handlebars')
const MainRouter=require('./routes/MainRouter')
const mongoose = require('mongoose')
const cookieParser=require('cookie-parser')
const path = require('path')
const PORT = process.env.PORT || 3000
const app = express()
const hbs = handlebars.create()
var conn = 'mongodb+srv://Vlad:qwerty123@cluster0.fxyla.mongodb.net/db'

app.engine('html', hbs.engine)
app.set('view engine','html')
app.set('views', 'views')
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(MainRouter)

async function start(){
    try{
      
      connection=await mongoose.connect(conn)
      app.listen(PORT,()=>{
        console.log('server has been started')
    })  
        
    }catch(e){
        console.log(e)
    }
}

start()