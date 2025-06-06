import { Label } from '@radix-ui/react-label'

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const {user}=useSelector(store=>store.auth)
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  const signUpHandler = async (e) => {
     e.preventDefault();
    try {
      setLoading(true)
    const res = await axios.post("https://instagramclone-u8xy.onrender.com/api/v1/user/register", input, {
        
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      console.log(res);
      
      
      
      if (res.data.success) {
        navigate('/login')
        toast.success(res.data.message)
        setInput({
          username: "",
          email: "",
          password: ""
        })

      }
      else{
        toast.error("signup failed..Please try again")
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)

    }
    finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(user){
      navigate('/')
    }
  })

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signUpHandler} className='shadow-lg flex flex-col gap-5 p-8 '>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Signup to see photos and videos</p>
        </div>
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="my-2 focus-visible:ring-transparent"
          />
          <Label>Email</Label>
          <Input
            type="text"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="my-2 focus-visible:ring-transparent"
          />
          <Label>Password</Label>
          <Input
            type="text"
            name="password"
            className="my-2 focus-visible:ring-transparent"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="text-white bg-black hover:text-black hover:bg-blue-800">SignUp</Button>
          )
        }

        <span className='text-center'>Already have an account ?<Link to="/login" className='text-blue-600'>Login</Link></span>
      </form>
    </div>
  )
}

export default Signup
