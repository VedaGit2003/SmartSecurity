import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import {connectDB} from './config/db.js'
import authroutes from './routes/auth.route.js'

const app=express()
//dotenv configuration done
dotenv.config()

//json accepted
app.use(express.json())
//set cookie parser
app.use(cookieParser())

//define port
const PORT=process.env.PORT || 3000
//mongodb connection request
connectDB()


//api end points
app.use('/api/auth',authroutes)

app.get('/',(req,res)=>{
    res.json({message:'Hellow auth'})
})

//server start listening
app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}`)
})