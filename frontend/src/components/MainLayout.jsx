import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'

function MainLayout() {
  return (
    <div>
        <LeftSideBar/>
        <div>
            <Outlet/>   {/* we use outlet to render children in main layout */}
        </div>
    </div>
  )
}

export default MainLayout