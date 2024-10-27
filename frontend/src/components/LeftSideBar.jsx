import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'


function LeftSideBar() {
    const navigate=useNavigate()
    const {user}=useSelector(store=>store.auth)
    const dispatch =useDispatch();
   const[open,setOpen]=useState(false)
    
const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Trending" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
        icon: (
            <Avatar className="w-6 h-6">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ), text: "Profile"
    },
    {icon:<LogOut/>,text:"LogOut"}

]

    const logoutHandler=async()=>{
        try {
            const res= await axios.get("http://localhost:8000/api/v1/user/logout",{withCredentials:true})
            if(res.data.success){
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate("/login")
              toast.success(res.data.message)

            }
            
        } catch (error) {
            toast.error(error.response.data.resposne)
            
        }
    }

    const sideBarHandler=(textItem)=>{
           if(textItem=="LogOut") {
            logoutHandler();
        } else if(textItem=="Create") {
            setOpen(true)
        } else if(textItem=='Profile'){
            navigate(`/profile/${user?._id}`)
        }
           
        
    }
    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
           <div className='flex flex-col'>
            <h1 className='my-8 pl-3 font-bold '>LOGO</h1>
            <div>
           {
                sideBarItems.map((item,index)=>{
                  return (
                    <div onClick={()=>sideBarHandler(item.text)} key={index} className='flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                        {item.icon}
                    <span>{item.text}</span>
                        </div>
                  )
                })
            }
           </div>
           </div>
          <CreatePost open={open} setOpen={setOpen}/>
        </div>
    )
}

export default LeftSideBar