import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from './routes/user.route.js'
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"

dotenv.config({})

const app= express()

const PORT=8000;


app.get("/",(req,res)=>{
 return res.status(200).json({
    message:"I'm comming from backend",
    success:true
 })

})
//middleware
app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOptions={
origin:'http://localhost:5173',
credentials:true,

}
app.use(cors(corsOptions))
//api 

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);




app.listen(PORT,()=>{
   connectDB()
  console.log(`Server running at port ${PORT}`)
})