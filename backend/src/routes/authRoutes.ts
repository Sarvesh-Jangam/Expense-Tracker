import express, { NextFunction } from "express";
import {protect} from "../middlewares/authMiddleware"
import { upload } from "../middlewares/uploadMiddleware";
import {
  registerUser,
  loginUser,
  getUserInfo
} from "../controllers/authController";

const router=express.Router();

router.post("/register", registerUser);
router.post("/loginUser", loginUser);
router.get("/getUserInfo", protect, getUserInfo);
router.post("/upload-image",upload.single("profile-img"),(req,res)=>{
  if(!req.file){
    return res.status(400).json({message: "No file atttached"});
  }
  const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${
    req.file?.filename
  }`;
  res.status(200).json({imageUrl});
})

export default router;