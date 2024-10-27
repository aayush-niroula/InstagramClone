import { setUserProfile } from '@/redux/authSlice';
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetUserProfile=(userId)=>{
    const dispatch= useDispatch()
    useEffect(()=>{
      
    const fetchUser =async()=>{
        try {
            const res= await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true})
            console.log(res);
            
           
            
            if(res.data.success){
              dispatch(setUserProfile(res.data.user)) 
              console.log(res.data);
              
           
              
            
            }
        
        } catch (error) {
            console.log(error);
            
        }
    }
   fetchUser();

    },[userId])
};
export  default useGetUserProfile