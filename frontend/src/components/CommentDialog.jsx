import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

function CommentDialog({ open }) {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagramclone-u8xy.onrender.com/api/v1/post${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost?._id ? { ...p, comments: updatedCommentData } : p
        );
        const updateSelectedPost = updatedPostData.find((post) => post._id === selectedPost._id);
        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost(updateSelectedPost));
        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <div className="bg-slate-100 border-t p-4 flex flex-col">
        <div className='overflow-y-auto max-h-60 mb-4'>
          {comment.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={text}
            onChange={changeEventHandler}
            placeholder='Add a comment...'
            className='w-full text-sm outline-none border-gray-300 p-2 rounded'
          />
          <Button variant='outline' disabled={!text.trim()} onClick={sendMessageHandler}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentDialog;
