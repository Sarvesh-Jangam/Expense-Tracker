import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';

//Generate JWT Token
const generateToken=async (id:mongoose.Types.ObjectId)=>{
  return jwt.sign({ id,},process.env.JWT_SECRET!,{ expiresIn:"1h" });
}

// Register User
export const registerUser=async (req:any,res:any)=>{
  const { fullName, email, password, profileImageUrl}=req.body || {};
  if(!fullName || !email || !password){
    return res.status(404).json({message: "All the given fields must be filled."});
  }
  try{
    //see if email already exists
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "The email already exists. Try SignIn."})
    }
    // create user
    const user=await User.create({
      fullName,
      email,
      password,
      profileImageUrl
    });

    res.status(200).json({
      message: `${email} successfully registered.`,
      id: user._id,
      user,
      token: await generateToken(user._id),
    });
  }catch(error: any){
    res
    .status(500)
    .json({
      message: `Error registering user ${email}`,
      error:error.message,
    })
  }
}
// Login User
export const loginUser=async (req:any,res:any)=>{
  const { email, password}=req.body;
  if(!email || !password){
    return res.status(404).json({message: "All the given fields must be filled"});
  }
  try{
    //see if email already exists
    const existingUser=await User.findOne({email});
    if(!existingUser){
      return res.status(400).json({message: "The email doen't exists in Database, Try SignUp."})
    }
    if(!(await existingUser.comparePassword(password))){
      return res.status(400).json({message: "Invalid password, try again."});
    }
    const { password: _, ...safeUser } = existingUser.toObject();
    res.status(200).json({
      id: safeUser._id,
      user: safeUser,
      token: await generateToken(safeUser._id)
    });
  }catch(error: any){
    res
    .status(500)
    .json({
      message: `Error logging in user ${email}`,
      error:error.message,
    })
  }
}
// getUserInfo User
export const getUserInfo=async (req:any,res:any)=>{
  try {
    // const user=await User.findById((await req.body?.user?.id)).select("-password");
  
    // if(!user){
    //   return res.status(404).json({message: "User not found"});
    // }
    
    res.status(200).json(req.user);
  } catch (error: any) {
    res.status(400).json({message: "Error getting userInfo.",error: error.message});
  }
  
}