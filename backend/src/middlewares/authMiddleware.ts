import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
import { NextFunction, Request, Response } from "express";
// import "dotenv/config";

export async function protect(req: Request, res:Response, next:NextFunction){
  let token=req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(401).json({message: "Not authorized, N token"});
  }
  try {
    const decoded:any=jwt.verify(token,process.env.JWT_SECRET || "");
    (req as any).user=await User.findById(decoded.id).select("-password");
    next();
  } catch (error:any) {
    res.status(400).json({message: "Not authorized, token failed",error:error.message});
    return;
  }
};