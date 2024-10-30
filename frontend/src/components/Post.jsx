import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { DialogContent } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { CiBookmark } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { toast } from 'sonner'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Badge } from './ui/badge'
function Post({ post }) {
    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)
    const { user,suggestedUsers } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const [liked, setLiked] = useState(post.likes.includes(user._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const [comment, setComment] = useState(post.comments)
    // const [follow,setFollow]=useState(false)
    const dispatch = useDispatch()

    const setEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }

    }
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1
                setPostLike(updatedLikes);
                setLiked(!liked)
                // update the post
                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                dispatch(setPosts(updatedPostData))

                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);

        }
    }
    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            })
         


            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? {
                        ...p, comments: updatedCommentData
                    } : p
                )
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error);

        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPost = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPosts(updatedPost))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    const bookmarkHandler =async ()=>{
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`,{withCredentials: true})
            
            if(res.data.success){
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            g
        }
    }

    
            // const fetchFollowOrUnfollow =async()=>{
            //     try {
            //         const followedId=user?._id
            //         const toFollow=suggestedUsers.map((user)=>user._id)
            //         const res =await axios.post(`http://localhost:8000/api/v1/user/followOrUnfollow/${user?._id}`,{followedId,toFollow},{
            //             headers:{
            //                 'Content-Type':'application/json'
                        
            //             },withCredentials:true
            //         }  )
            //         console.log(res.data);
                    
            //     } catch (error) {
            //         console.log(error);
                    
            //     }
       
            // }

      

   

    return (

        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage className='object-scale-down rounded-3xl h-14' src={post.author?.profilePicture} alt='post-image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                    <h1>{post.author?.username}</h1>
               {user._id ===post.author._id &&
                <Badge variant="secondary">Author</Badge>
               }   
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col' >
                        {
                            user && user?._id !== post.author._id &&
                            <Button variant='ghost' className='cursor-pointer  w-fit text-[#ED4956] font-bold'>Unfollow</Button>
                        }
                      
                        <Button variant='ghost' className='cursor-pointer w-fit '>Add to Favourite </Button>

                        {
                            user && user._id === post.author._id &&
                            <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm m-2 w-full aspect-square object-cover' src={post.image} alt="post-img" />


            <div className='flex items-center justify-between my-2'>
                <div className='flex gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} className='cursor-pointer hover:text-gray-600' size={'22px'} /> :
                            < FaRegHeart onClick={likeOrDislikeHandler} className='cursor-pointer hover:text-gray-600' size={'22px'} />
                    }

                    <FiMessageCircle onClick={() => {
                        console.log(post);
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <LuSend size={'22px'} className='cursor-pointer hover:text-gray-600' />
                </div>
                <CiBookmark onClick={bookmarkHandler}className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block m-b-2'>{post.likes.length}</span>
            <p>
                <span className='font-medium mr-2'>{post.author.username}</span>
                {post.caption}
            </p>
            {
                comment.length >= 0 && (
                    <span className='cursor-pointer text-sm text-gray-400' onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }}>View all {comment.length} comments</span>
                )
            }

            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input type="text"
                    value={text}
                    onChange={setEventHandler}

                    placeholder='Add a comment...'
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#38ADF8] cursor-pointer'>Post</span>
                }

            </div>

        </div>
    )
}

export default Post