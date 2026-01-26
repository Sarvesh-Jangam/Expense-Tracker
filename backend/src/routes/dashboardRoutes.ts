import express  from "express";
import { protect } from "../middlewares/authMiddleware";
import { getDashboardData } from "../controllers/dashboardController";

const router=express.Router();

router.get("/",protect,getDashboardData);

export default router;
