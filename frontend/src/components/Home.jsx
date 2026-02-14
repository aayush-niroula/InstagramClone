import React, { useEffect } from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home=()=> {
 
    useGetAllPosts();
    useGetSuggestedUsers();
  
  return (
    <div className='flex flex-col lg:flex-row'>
      <div className='flex-grow w-full lg:w-auto'>
        <Feed/>

        <Outlet/>

      </div>
      <RightSideBar/>
    </div>
  )
}

export default Home