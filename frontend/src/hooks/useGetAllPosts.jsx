import { setPosts } from '@/redux/postSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPosts=()=>{
    const dispatch= useDispatch()
    useEffect(()=>{
    const fetchAllPost =async()=>{
        try {
            const res= await axios.get('https://instagramclone-u8xy.onrender.com/api/v1/post/all',{withCredentials:true})
            if(res.data.success){
              dispatch(setPosts(res.data.post))
        
            
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }
   fetchAllPost();

    },[])
};
export default useGetAllPosts