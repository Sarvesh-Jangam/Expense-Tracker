import mongoose from "mongoose";
import 'dotenv/config'
import { setServers } from "dns";

export const connectDB = async () => {
  setServers(["1.1.1.1", "8.8.8.8"]);
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected successfully!');
  } catch (err:any) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
}