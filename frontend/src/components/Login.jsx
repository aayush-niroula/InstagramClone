import { Label} from '@radix-ui/react-label'

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import Signup from './Signup'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login=()=> {
    const [loading,setLoading]=useState(false)
    const {user}=useSelector(store=>store.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()
  const[input,setInput]=useState({
    email:"",
    password:""
  })

  const changeEventHandler=(e)=>{
    setInput({...input,[e.target.name]:e.target.value})
  }
  const signUpHandler=async(e)=>{
    await e.preventDefault();
    console.log(input);
    try {
      setLoading(true)
      const res= await axios.post("http://localhost:8000/api/v1/user/login",input,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      if(res.data.success){
        dispatch(setAuthUser(res.data.user))
        navigate("/")
        toast.success(res.data.message)
        setInput({
          email:"",
          password:""
        })

      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(user){
      navigate("/")
    }
  },[])

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signUpHandler} className='shadow-lg flex flex-col gap-5 p-8 '>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Login to see photos and videos</p>
            </div>
            <div>
                 <Label>Email</Label>
                <Input
                type="text"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                 className="my-2"
                />
                 <Label>Password</Label>
                <Input
                type="text"
                name="password"
                 className="my-2"
                 value={input.password}
                 onChange={changeEventHandler}
                />
            </div>
            {
             loading ?(
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait 
              </Button>
             ):(
                <Button type="submit" className="text-white bg-black hover:text-black hover:bg-blue-800">Login</Button>
             )
            }
            
            <span className='text-center'>Doesn't  have an account ?<Link to="/signup" className='text-blue-600'>Signup</Link></span>
        </form>
    </div>
  )
}

export default Login
