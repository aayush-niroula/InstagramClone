import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'

function MainLayout() {
  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
        <LeftSideBar/>
        <div className='flex-1 pb-16 md:pb-0 md:ml-[70px] lg:ml-[16%]'>
            <Outlet/>   {/* we use outlet to render children in main layout */}
        </div>
    </div>
  )
}

export default MainLayout