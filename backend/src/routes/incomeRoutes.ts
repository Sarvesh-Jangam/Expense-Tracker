import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel
} from "../controllers/incomeController";

const router=express.Router();

router.post("/add",protect,addIncome);
router.get("/get",protect,getAllIncome);
router.get("/downloadExcel",protect,downloadIncomeExcel);
router.delete("/delete/:id",protect,deleteIncome);

export default router;