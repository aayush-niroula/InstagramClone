import React, { useEffect, useMemo, useRef } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessaage'
import useGetRTM from '@/hooks/useGetRTM'

function Messages({selectedUser}) {
  useGetRTM()
  useGetAllMessage()
  const {user}= useSelector(store=>store.auth)
const {messages}=useSelector(store=>store.chat)
const messageRef= useRef(null)

useEffect(()=>{
  messageRef.current?.scrollIntoView({behavior:'smooth'})
},[messages])

const filteredMessages = useMemo(() => 
  messages?.filter(msg => 
      (msg.senderId === user?._id && msg.receiverId === selectedUser?._id) || 
      (msg.senderId === selectedUser?._id && msg.receiverId === user?._id)
  ), 
  [messages, user, selectedUser]
);
  return (
    <div className='overflow-y-auto flex-1 p-4'>
       <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
       <Avatar className='h-20 w-20'>
        <AvatarImage src={selectedUser?.profilePicture} alt='profile'/>
        <AvatarFallback>CN</AvatarFallback>
       </Avatar>
        <span>{selectedUser?.username}</span>
       <Link to={`profile/${selectedUser?._id}`}><Button className='h-8 my-2' variant="secondary">View Profile</Button></Link>  
        </div>
       </div>
       <div className='flex flex-col gap-3'>
       {
        filteredMessages?.map((msg)=>{
            return(
                <div key={msg._id}  className={`flex flex-1  ${msg.senderId ===user?._id ? 'justify-end':'justify-start'} `}>
                  
                    <div  className={`p-2 rounded-xl max-w-xs break-words ${msg.senderId ===user?._id ? 'bg-blue-500 text-white':'bg-gray-200 text-black'}`}>
                        {msg.message}
                    </div>

                </div>
            )
        })
       }
       </div>
    </div>
  )
}

export default Messages