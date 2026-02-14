import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '@/redux/authSlice'
import { Button } from './ui/button'
import { MessageCircleCode } from 'lucide-react'
import Messages from './Messages'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice'

function ChatPage() {
    const[textMessage,setTextMessage]=useState("")
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth)
    const {onlineUsers,messages}=useSelector(store=>store.chat)
    const dispatch = useDispatch()

    const sendMessageHandler=async (receiverId)=>{
      try {
        const res = await axios.post(`https://instagramclone-u8xy.onrender.com/api/v1/message/send/${receiverId}`,{textMessage},{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true
        })
        if(res.data.success){
            dispatch(setMessages([...messages,res.data.newMessage]))
            setTextMessage('')
        }
      } catch (error) {
        console.log(error);
        
      }
    }
    useEffect(()=>{
        return()=>{
            dispatch(setSelectedUser(null))
        }
    },[])
   
    return (
        <div className='flex flex-col md:flex-row h-screen'>
            <section className='w-full md:w-1/3 lg:w-1/4 my-4 md:my-8 border-b md:border-b-0'>
                <h1 className='font-bold text-xl mb-4 px-3'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[30vh] md:h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            
                            const isOnline =onlineUsers.includes(suggestedUser?._id)
                            return (
                            
                                    <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer'>
                                    <Avatar className='border border-slate-400 w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-sm  font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                               
                               
                              
                            )
                        })
                    }
                </div>
            </section>
        
                {
                    selectedUser ? (
                        <section className='flex-1 border-l-0 md:border-l border-l-gray-300 flex flex-col h-[50vh] md:h-full'>
                            <div className='flex gap-3 items-center px-3 py-3 border-b border-gray-300 sticky top-0 bg-white z-10'>
                                <Avatar>
                                    <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                    <AvatarFallback></AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span>{selectedUser?.username}</span>
                                </div>
                             </div>
                             <Messages selectedUser={selectedUser}/>
                                <div className='flex items-center p-4 border-t border-t-gray-300'>
                                    <input type="text" value={textMessage} onChange={(e)=>setTextMessage(e.target.value)}className='flex w-full mr-2 focus-visible:ring-transparent border rounded px-2 py-1' placeholder='Messages...' />
                                    <Button onClick={()=>sendMessageHandler(selectedUser?._id)}>Send</Button>
                                </div>
                            
                        </section>
                    ) : (
                        <div className='flex flex-col items-center justify-center mx-auto'>
                            <MessageCircleCode className='w-32 h-32 my-4' />
                            <h1 className='font-bold'>Your messages</h1>
                            <span>Send a messages to start a chat</span>
                        </div>
                    )
                }
        </div>
    )
}

export default ChatPage