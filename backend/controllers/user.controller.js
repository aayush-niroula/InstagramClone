import { User } from "../model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing! check",
                status: false
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "Email already exists",
                status: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
    
        //create new user

        await User.create({
            username,
            password: hashPassword,
            email
        });

        return res.status(201).json({
            message: "Account created successfully",
            status: true
        })



    } catch (error) {
        console.log(error);

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing,check",
                status: false
            })
        }
      let user=await User.findOne({email})
      if(!user){
        return res.status(401).json({
            message: "email or password is incorrect",
            status: false
        })
      }

      const isPasswordMatch=await bcrypt.compare(password,user.password)
       if(!isPasswordMatch){
        return res.status(401).json({
            message: "email or password is incorrect",
            status: false
        })
       }
       
       const token=jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
       //populate each post if in the post array
       
       const populatedPost = await Promise.all(
        user.posts.map(async(postId) => {
            const post= await Post.findById(postId);
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
        })
       )
       
       user={
        _id:user._id,
        username:user.username,
        email:user.email,
        bio:user.bio,
        profilePicture:user.profilePicture,
        followers:user.followers,
        following:user.following,
        posts:user.posts
    

       }


     
     return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
        message:`Welcome back ${user.username}`,
        success:true,
        user
     })

    } catch (error) {
        console.log(error);

    }
}
////logout 

export const logout=async(req,res)=>{
   try {
    return res.cookie("token","",{maxAge:0}).json({
        message:"LoggedOut succcesfully",
        success:true
    })
   } catch (error) {
    console.log(error);
    
   }
}

//profile get

export const getProfile=async(req,res)=>{
    try {
        const userId= req.params.id;
       let user=await User.findById(userId).populate({path:'posts',createdAt:-1}).populate({path:'bookmark',createdAt:-1});
      return res.status(200).json({
        user,
        success:true
      })
      

    } catch (error) {
        console.log(error);
        
    }
}

//edit profile

export const editProfile=async (req,res) => {
    try {
    const userId=req.id;
    const{bio,gender}=req.body;
    const{profilePicture}=req.file;
    let cloudResponse;


    if(profilePicture){
     const fileUri=getDataUri(profilePicture)
    cloudResponse= await cloudinary.uploader.upload(fileUri);
    }
    const user=await User.findById(userId).select('-password')
    if(!user){
        return res.status(404).json({
            message:"User not found",
            success:false
        })
    };
    if(bio) user.bio=bio;
    if(gender) user.gender=gender;
    if(profilePicture) user.profilePicture=cloudResponse.secure_url;
   await user.save();
 return res.status(200).json({
    message:'profile updated', 
    success:true,
    user
 })
    
        
    } catch (error) {
        console.log(error);
        
    }
}

///get others user

export const getSuggestedUser=async (req,res)=>{
  try {
    const suggestedUser= await User.find({_id:{$ne:req.id}}).select('-password')
    if(!suggestedUser){
        
        return res.status(400).json({
            message:"Currently donot have users"
        })
    }
    
    return res.status(200).json({
       success:true,
       users:suggestedUser
    })
    
  } catch (error) {
    console.log(error);
    
  }

}

///follower or unfollow

export const followOrUnfollow=async (req,res) => {
    try {
        const follwedId=req.id;
        const toFollow=req.params.id;
        if(follwedId===toFollow){
            return res.status(400).json({
                message:'You cannot follow or unfollow yourself',
                success:false
            })
        }
     const user=await User.findById(follwedId);
     const targetUser=await User.findById(toFollow)
    
     if(!user ||!targetUser){
        return res.status(400).json({
            message:'You cannot follow or unfollow yourself',
            success:false
        })
     }
     //now to check weather too follow  or unfollow
     
     const isFollowing= user.following.includes(toFollow)
     if(isFollowing){
        //unfollow means already following
        await Promise.all([
            User.updateOne({_id:follwedId},{$pull:{following:toFollow}}),
            User.updateOne({_id:toFollow},{$pull:{followers:follwedId}}),
        ])
      return res.status(200).json({message:'Unfollow sucesssfully',success:true})
     }
     else{
        //follow ----means yet to follow
       await Promise.all(
        [
        User.updateOne({_id:follwedId},{$push:{following:toFollow}}),
        User.updateOne({_id:toFollow},{$push:{followers:follwedId}}),
        ]
       )
     }
     return res.status(200).json({message:'follow sucesssfully',success:true})


    } catch (error) {
        
    }
}

