import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {toast} from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setAuthUser } from '@/redux/authSlice'

function EditProfile() {
    const { user } = useSelector(store => store.auth)
    const imageRef = useRef()
    const [loading,setLoading]=useState(false)
    const [input ,setInput]=useState({
        profilePhoto:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    })
    const navigate=useNavigate()
    const dispatch= useDispatch()
    
    const fileChangehandler=async(e)=>{

        const file =e.target.files?.[0]
        console.log(file);
        
        if(file) setInput({...input,profilePhoto:file})
                
            

    
       
        
        
    }
    const selectChangeHandler =(value)=>{
        setInput({...input,gender:value})
    }

    const editProfileHandler=async ()=>{ 
        const formdata =new FormData()
        formdata.append("bio",input.bio)
        formdata.append('gender',input.gender)
          formdata.append("profilePhoto",input.profilePhoto)
        
        // if(input.profilePicture){
        // }
        try {
            setLoading(true)
            const res =await axios.put('http://localhost:8000/api/v1/user/profile/edit',formdata,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
               withCredentials:true
            })
            console.log(res.data);
            
            if(res.data.success){
                const updatedUserData ={
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender
                }
                dispatch(setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)

                toast.success(res.data.message);
            
            }
            
            
        } catch (error) {
            console.log(error);
            
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div>

                    <div className='flex items-center justify-between bg-gray-100 rounded p-6'>
                        <div className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage  src={user?.profilePicture} alt='post-image' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className='font-bold text-sm'>{user?.username}</h1>
                                <span className='text-gray-600'>{user?.bio || 'Bio here'}</span>
                            </div>
                        </div>
                        <input ref={imageRef} onChange={fileChangehandler} type="file" className='hidden' />
                        <Button onClick={() => imageRef.current.click()} className='bg-[#0095f6] text-white h-8 hover:bg-[#206c9f] rounded-[6px]'>Change Photo</Button>
                    </div>
                    <div>
                        <h1 className='font-bold text-xl mb-2'>Bio</h1>
                        <Textarea value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} className='focus-visible:ring-transparent' />
                    </div>
                    <div>
                        <h1 className='font-bold mb-2'>Gender</h1>
                        <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (

                            <Button className='w-fit bg-[#0095f6] hover:bg-[#2373a8] rounded-[4px]'>

                                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                Please wait
                            </Button>
                        ):(

                            <Button onClick={editProfileHandler} className='w-fit bg-[#0095f6] hover:bg-[#2373a8] rounded-[4px]'>Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}
export default EditProfile