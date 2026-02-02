import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
  comparePassword(pass: string): Promise<boolean>;
}

const userSchema= new mongoose.Schema<IUser>({
  fullName:{
    type:String,
    required:true,
    index:true,
    lowercase:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
  },
  password:{
    type:String,
    required:true,
  },
  profileImageUrl:{
    type:String,
    default:null
  },
},{timestamps:true})

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete (ret as any).password;
    delete (ret as any).__v;

    // ret.id = ret._id;
    // delete ret._id;

    return ret;
  },
});

//hash password before saving
userSchema.pre("save",async function(){
  if(!this.isModified('password')) return;
  this.password=await bcrypt.hash(this.password,10);
})

// compare passwords
userSchema.methods.comparePassword=async function (pass:string){
  return await bcrypt.compare(pass,this.password);
}

export const User=mongoose.model<IUser>("User",userSchema);