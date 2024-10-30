
import { setMessages } from '@/redux/chatSlice';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetRTM=()=>{
    const dispatch= useDispatch()
   const {socket}=useSelector(store=>store.socketio)
   const {messages}=useSelector(store=>store.chat)
    useEffect(()=>{
   socket?.on('newMessage',(message)=>{
     dispatch(setMessages([...messages,message]))
   })
   return()=>{
    socket?.off('newMessage')
   }

    },[messages,setMessages])
};
export default useGetRTM