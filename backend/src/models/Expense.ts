import mongoose from "mongoose";
import { User } from "./User";

const expenseSchema=new mongoose.Schema({
  userId:{type: mongoose.Types.ObjectId, ref: User, required: true},
  icon: {type:String},
  amount:{type:Number,required: true},
  category:{type: String,required:true},
  date:{type: Date,default: Date.now}
},{timestamps:true})

export const Expense=mongoose.model("Expense",expenseSchema);