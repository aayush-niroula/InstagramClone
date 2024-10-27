import { Avatar } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign } from 'lucide-react'

function Profile() {
  const params = useParams()
  const userId = params.id;
  useGetUserProfile(userId)
  const [activeTab,setActiveTab]=useState('posts')

const { userProfile } = useSelector(store => store.auth)
 const isLoggedInUserProfile =true
 const isFollowing= false
const handleTabChange =(tab)=>{
  setActiveTab(tab)
}
const displayPost = activeTab =='posts' ? userProfile?.posts : userProfile?.bookmarks


  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
     <div className='flex flex-col gap-20 p-8'>

      <div className='grid grid-cols-2'>
        <section className='flex items-center justify-center'>
          <Avatar className='h-32 w-32  rounded-full border'>
            <AvatarImage src={userProfile?.profilePicture} alt="profilePicture"  />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </section>

        <section>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
            <span>{userProfile?.username}</span>
            {
              isLoggedInUserProfile ? (
                <>
                <Button variant='secondary' className='rounded-[6px] bg-gray-200 hover:bg-gray-400 h-8'>Edit Profile</Button>
                <Button variant='secondary' className='rounded-[6px] bg-gray-200 hover:bg-gray-400 h-8'>View Archive</Button>
                <Button variant='secondary' className='rounded-[6px] bg-gray-200 hover:bg-gray-400 h-8'>Ad tools</Button>
                </>
              ):(
                isFollowing ? (
                  <>
                  <Button variant='secondary'className='h-8 rounded-[6px] bg-gray-200'>UnFollow</Button>
                  <Button className='bg-gray-200 rounded-[6px]  h-8 '>Message</Button>
                  </>
                  
                ):(
                <Button className='bg-[#0095F6] hover:bg-[#156aa3] h-8 rounded-[6px]'>Follow</Button>           
                )
              )
            }
        
          </div>
          <div className='flex items-center gap-4'>
            <p ><span className='font-semibold'>posts</span>{userProfile?.posts.length}</p>
            <p ><span className='font-semibold'>followers</span>{userProfile?.followers.length}</p>
            <p ><span className='font-semibold'>following</span>{userProfile?.following.length}</p>
            
            
          </div>
          <div className='flex flex-col gap-1'>
            <span className='font-semibold'>{userProfile?.bio || 'Bio here..'}</span>
            <Badge className={'w-fit bg-gray-300 rounded-[3px]'} variant={'secondary'}><AtSign/><span className='pl-1'>{userProfile?.username}</span></Badge>
          <span>I'm fullstack developer 😊</span>
          <span>Turning code into fun 😊</span>
          <span>Contact me .. 9827***8*81 😊</span>

          </div>

            </div>
           
        </section>
      </div>
       <div className='border-t border-t-gray-200'>
        <div className='flex items-center justify-center gap-10 text-sm'>
         <span onClick={()=>handleTabChange('posts')} className={`py-3 cursor-pointer ${activeTab=='posts' ? 'font-bold':''}`}>
          POSTS
         </span>
         <span onClick={()=>handleTabChange('saved')} className={`py-3 cursor-pointer ${activeTab=='saved' ? 'font-bold':''}`}>
          SAVED
         </span>
         <span className='py-3 cursor-pointer'>
          REELS
         </span>
         <span className='py-3 cursor-pointer'>
          TAGS
         </span>
        </div>
        
        <div>
          {
            displayPost ?.map((post)=>{
              return(
                <div key={post?._id}>
                  
                </div>
              )
            })
          }
        </div>
        

       </div>
     </div>
    </div>
  )
}

export default Profile