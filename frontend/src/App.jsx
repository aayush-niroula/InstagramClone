import { useState } from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'

const browserRouter= createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/profile/:id',
        element:<Profile/>
      },
    
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
])
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
