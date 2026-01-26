import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel
} from "../controllers/expenseController";

const router=express.Router();

router.post("/add",protect,addExpense);
router.get("/get",protect,getAllExpenses);
router.get("/downloadExcel",protect,downloadExpenseExcel);
router.delete("/delete/:id",protect,deleteExpense);

export default router;