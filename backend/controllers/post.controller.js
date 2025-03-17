import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../model/post.model.js';
import { User } from '../model/user.model.js';
import { Comment } from '../model/comment.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
export const addNewPost=async (req,res) => {
    try {
        const {caption}=req.body;
        const image=req.file;
        const authorId=req.id; 
        if(!image){
            return res.status(400).json({
                message:"Image required"
            })
        }
        //image upload
       const optimizedImageBuffer=await sharp(image.buffer).resize({width:800,height:800,fit:'inside'})
       .toFormat('jpeg',{quality:80})
       .toBuffer();
      //image is converted into data uri 
       const fileUri=`data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
      const cloudResponse= await cloudinary.uploader.upload(fileUri);
        
       


      const post = await Post.create({
        caption,
        image:cloudResponse.secure_url,
        author:authorId,
      })
      const user=await User.findById(authorId);
      if(user){
       user.posts.push(post._id)
       await user.save()
      }
      
      await post.populate({path:'author',select:'-password'})
      return res.status(200).json({
        message:"New post added",

        success:true,
        post
      })
       
    } catch (error) {
        console.log(error);
        
    }
    
}

//get all post

export const getAllPost=async (req,res) => {
    try {
        const post= await Post.find().sort({createdAt:-1})
        .populate({path:'author' ,select:'profilePicture username'})
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        });
       
        return res.status(200).json({
            post,
            success:true
        })

    } catch (error) {
        console.log(error);
        
    }
    
};
//posts which i posts
export const getUserpost=async (req,res) => {
    try {
        const authorId=req.id;
          
        const posts =await Post.find({author:authorId}).sort({createdAt:-1})
        .populate({        //author ko posts get garyo
            path:'author',
            select:'username profilePicture ',
        }).populate({        //post vitra ko comment 
            path:'comments',
            sort:{createdAt:-1},
            populate:{    //comment vitra ko comment gareko author username ra PP
                path:'author',
                select:'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success:true
        })

    } catch (error) {
        console.log(error);
        
    }
    
}

//LikePost

export const likePost=async (req,res) => {
    try {
        const likeGarneManxe=req.id;
        const postId=req.params.id;
        const post= await Post.findById(postId)
         if(!post) return res.status(404).json({message:"Post not found",status:false})
        
    await post.updateOne({$addToSet:{likes:likeGarneManxe}})
    await post.save();

    //implement socket io for real time notification

    const user =await User.findById(likeGarneManxe).select('username profilePicture');
    const postOwnerId=post.author.toString()
    if(postOwnerId !== likeGarneManxe){
        //emit notification event
        const notification ={
            type:'like',
            userId:likeGarneManxe,
            userDetails:user,
            postId,
            message:'Your post was liked'
        }
        const postOwnerSocketId=getReceiverSocketId(postOwnerId)
        io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({message:"Post Liked",success:true})


    } catch (error) {
        console.log(error);
        
    }
    
}

export const dislikePost=async (req,res) => {
    try {
        const likeGarneManxe=req.id;
        const postId=req.params.id;
        const post= await Post.findById(postId)
         if(!post) return res.status(404).json({message:"Post not found",status:false})
        
    await post.updateOne({$pull:{likes:likeGarneManxe}})
    await post.save();

    //implement socket io for real time notification

    const user =await User.findById(likeGarneManxe).select('username profilePicture');
    const postOwnerId=post.author.toString()
    if(postOwnerId !== likeGarneManxe){
        //emit notification event
        const notification ={
            type:'dislike',
            userId:likeGarneManxe,
            userDetails:user,
            postId,
            message:'Your post was disliked'
        }
        const postOwnerSocketId=getReceiverSocketId(postOwnerId)
        io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({message:"Post disliked",success:true})


    } catch (error) {
        console.log(error);
        
    }
    
}
  

//add Comment

export const addCommment= async (req,res) => {
    try {
        const postId=req.params.id;
        const commentGarne=req.id;

        const {text}=req.body;
        const post= await Post.findById(postId)
        if(!text) return res.status(404).json({message:"Empty messege"})
        
            const comment= await Comment.create({
                text,
                author:commentGarne,
                post:postId
            })
      await comment.populate({
        path:"author",
        select:"username profilePicture"
      });
      post.comments.push(comment._id)
     await post.save();
     return res.status(201).json({
        message:"comment added in the post",
        comment,
        success:true
     })
    } catch (error) {
        console.log(error);
        
    }
    
}

//get all post comments

export const getAllComments=async (req,res) => {
    try {
        const postId=req.params.id;
        const comments= await Comment.find({post:postId}).populate('author','username profilePicture') //same as using path ....it is shortcut form

        if(!comments){
            return res.status(404).json({
                message:"No comments found",
                success:false
            })
        }

        return res.status(200).json({comments, success:true})

    } catch (error) {
        console.log(error);
        
    }
    
}
//delete post

export const deletePost= async (req,res) => {
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({message:"Post not found"})
    //check if login user is the owner of the post
    if(post.author.toString()!==authorId) return res.status(403).json({message:"Unauthorized"})
    
    //delete post
    
    await Post.findByIdAndDelete(postId);

    //remove postid from user post
    let user= await User.findById(authorId)
    user.posts=user.posts.filter(id=> id.toString()!==postId);
    await user.save();


    //delete associated comments
    await Comment.deleteMany({post:postId});

    return res.status(200).json({
        success:true,
        message:"Post Deleted"
    })

    } catch (error) {
        console.log(error);
        
    }
    
}


//bookmark post

export const bookmarkPost= async (req,res) => {
    try {
        const postId= req.params.id;
        const authorId= req.id;
        const post= await Post.findById(postId)
        if(!post) return res.status.json({messsage:"Post not foound"})
      
           const user= await User.findById(authorId)
      if(user.bookmarks.includes(post._id)){
        //then we have to unbookmark---or remove 
       await user.updateOne({$pull:{bookmarks:post._id}})
       await user.save()
       return res.status(200).json({type:'unsaved',message:"Post removed from bookmark",success:true})
      } else{
        //then bookmark
        await user.updateOne({$push:{bookmarks:post._id}})
        await user.save()
        return res.status(200).json({type:'unsaved',message:"Post bookmark",success:true})
      }     
    

    } catch (error) {
        console.log(error);
        
    }
    
}
