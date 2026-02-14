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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'


function LeftSideBar() {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)

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
        { icon: <LogOut />, text: "LogOut" }

    ]

    // Mobile bottom nav items (subset)
    const mobileNavItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <PlusSquare />, text: "Create" },
        { icon: <MessageCircle />, text: "Messages" },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        }
    ]

    const logoutHandler = async () => {
        try {
            const res = await axios.get("https://instagramclone-u8xy.onrender.com/api/v1/user/logout", { withCredentials: true })
            if (res.data.success) {
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

    const sideBarHandler = (textItem) => {
        if (textItem == "LogOut") {
            logoutHandler();
        } else if (textItem == "Create") {
            setOpen(true)
        } else if (textItem == 'Profile') {
            navigate(`/profile/${user?._id}`)
        } else if (textItem == 'Home') {
            navigate("/")
        } else if (textItem == 'Messages') {
            navigate("/chat")
        }


    }
    return (
        <>
            {/* Desktop Sidebar */}
            <div className='hidden md:flex fixed top-0 z-10 left-0 px-2 lg:px-4 border-r border-gray-300 w-[70px] lg:w-[16%] h-screen'>
                <div className='flex flex-col w-full'>
                    <h1 className='my-8 pl-3 font-bold hidden lg:block'>LOGO</h1>
                    <h1 className='my-8 pl-3 font-bold lg:hidden text-center'>L</h1>
                    <div>
                        {
                            sideBarItems.map((item, index) => {
                                return (
                                    <div onClick={() => sideBarHandler(item.text)} key={index} className='flex items-center justify-center lg:justify-start gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                        {item.icon}
                                        <span className='hidden lg:inline'>{item.text}</span>
                                        {
                                            item.text === "Notification" && likeNotification.length >0  && (
                                          <Popover>
                                              <PopoverTrigger asChild>
                                                  <Button size='icon' className='rounded-full h-5 w-5 bg-red-500 absolute buttom-6 left-6'>{likeNotification.length}</Button>
                                              </PopoverTrigger>
                                              <PopoverContent>
                                                   <div>
                                                            {
                                                                likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                    likeNotification.map((notification) => {
                                                                        return (
                                                                            <div key={notification.userId} className='flex items-center gap-2 '>
                                                                                <Avatar>
                                                                                    <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                    <AvatarFallback>CN</AvatarFallback>
                                                                                </Avatar>
                                                                                <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span>liked your post</p>

                                                                            </div>
                                                                        )
                                                                    })
                                                                )
                                                            }
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300'>
                <div className='flex justify-around items-center py-2'>
                    {
                        mobileNavItems.map((item, index) => (
                            <div 
                                onClick={() => sideBarHandler(item.text)} 
                                key={index} 
                                className='flex flex-col items-center p-2 cursor-pointer'
                            >
                                {item.icon}
                            </div>
                        ))
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </>
    )
}

export default LeftSideBar