import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
  billScanner
} from "../controllers/expenseController";
import {upload} from "../middlewares/uploadMiddleware"

const router=express.Router();

router.post("/add",protect,addExpense);
router.get("/get",protect,getAllExpenses);
router.get("/downloadExcel",protect,downloadExpenseExcel);
router.delete("/delete/:id",protect,deleteExpense);
router.post("/scanBill",protect,upload.single("bill"),billScanner);

export default router;