import express, { NextFunction } from "express";
import {protect} from "../middlewares/authMiddleware"
import { upload } from "../middlewares/uploadMiddleware";
import {
  registerUser,
  loginUser,
  getUserInfo
} from "../controllers/authController";
import { uploadOnCloudinary } from "../utils/cloudinary";

const router=express.Router();

router.post("/register", registerUser);
router.post("/loginUser", loginUser);
router.get("/getUserInfo", protect, getUserInfo);
router.post("/upload-image",upload.single("profile-img"),async (req,res)=>{
  if(!req.file){
    return res.status(400).json({message: "No file atttached"});
  }
  const imageUrl=`${process.cwd()}/uploads/${
    req.file?.filename
  }`;
  const image=await uploadOnCloudinary(imageUrl);
  res.status(200).json({imageUrl: image?.secure_url});

})

export default router;