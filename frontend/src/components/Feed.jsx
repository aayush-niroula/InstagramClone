import React from 'react'
import Posts from './Posts'

function Feed() {
  return (
    <div className='flex-1 my-4 md:my-8 flex-col items-center px-4 sm:px-6 md:px-8 lg:pl-[5%] xl:pl-[10%]'>
        <Posts/>

    </div>
  )
}

export default Feed