import mongoose from "mongoose";
import { User } from "./User";

const incomeSchema=new mongoose.Schema({
  userId: {
    type:mongoose.Types.ObjectId,
    ref:User,
    required:true
  },
  source: {type: String, required: true},
  amount: {type: Number, required: true},
  date: {type: Date, default: Date.now}

},{timestamps:true})

export const Income= mongoose.model("Income",incomeSchema);