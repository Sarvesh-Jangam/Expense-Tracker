import express, { Request, Response } from "express";
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import incomeRoutes from "./routes/incomeRoutes";
import expenseRoutes from "./routes/expenseRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"

connectDB();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
//serve uploads folder
app.use("/uploads",express.static(path.join(process.cwd(),"uploads")))

export default app