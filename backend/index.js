import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from './routes/user.route.js'
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { app,server } from './socket/socket.js'
import path from 'path'


dotenv.config({})



const PORT=8000;

const _dirname= path.resolve()





//middleware
app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOptions={
origin:process.env.URL || "https://instagramclone-u8xy.onrender.com",
credentials:true,

}
app.use(cors(corsOptions))
//api 

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
   res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})



server.listen(PORT,()=>{
   connectDB()
  console.log(`Server running at port ${PORT}`)
})