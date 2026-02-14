import { Expense } from "../models/Expense";
import xlsx from "xlsx";
import { Response, response } from "express";
import path from "path";
import moment from "moment";
import fs from "fs";
import {parseExpenseWithAI} from "../services/aiService";
import {extractTextFromImage} from "../services/ocrService";
import {extractTextFromPDF} from "../services/pdfService";

const categoryIcons : any = {
  Food: "🍕",
  Grocery: "🛒",
  Rent: "🏠",
  Shopping: "🛍️",
  Transport: "🚗",
  Utilities: "💡",
  Entertainment: "🎬",
  Other: "📦",
  Medical: "🚑"
};


// Add Expense source
export const addExpense=async (req: any,res: any)=>{
  const userId=req.user.id;

  try{
    const {category, amount, date, icon}=req.body;
    console.log("Date in expense Controller: ",date);
    const newExpense=new Expense({
      userId,
      category,
      amount,
      icon,
      date: new Date(date)
    })
    await newExpense.save();
    res.json({newExpense});
  }
  catch(error){
    res.status(404).json({message:"Error in saving the newExpense.",error});
  }
}
// Get all Expenses
export const getAllExpenses=async (req:any,res:any)=>{
  const userId=req.user.id;

  try {
    const expenses=await Expense.find({userId}).sort({date:-1});
    res.status(200).json(expenses);
  } catch (error:any) {
    res.status(400).json({message:"Error fetching all Expenses.",error: error.message});
  }
}
// delete a Expense
export const deleteExpense=async (req:any,res:any)=>{
  try {
    await Expense.findByIdAndDelete(req.params?.id);
    res.json({message: "Expense deleted successfully."});
  } catch (error) {
    res.status(500).json({message: "server error."});
  }
}
// // download Expense excel
// export const downloadExpenseExcel=async (req:any,res:Response)=>{
//   const userId=req.user.id;
//   try {
//     const expenses=await Expense.find({userId}).sort({date:-1});

//     const wb=xlsx.utils.book_new();
//     const ws=xlsx.utils.json_to_sheet(expenses);

//     xlsx.utils.book_append_sheet(wb,ws,"expense_details.xlsx");
//     xlsx.writeFile(wb,path.join(process.cwd(),"uploads","expense_details.xlsx"));
//     res.download(path.join(process.cwd(),"uploads","expense_details.xlsx"));
//   } catch (error:any) {
//     res.status(500).json({message: "Server Error",error:error.message});
//   }
// }

let fileToDelete="";

export const downloadExpenseExcel = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .lean();

    const formattedData = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: moment(item.date).format("DD MMM YYYY"),
      Icon: item.icon || "",
      CreatedAt: moment(item.createdAt).format("DD MMM YYYY"),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(formattedData);

    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    const uploadsDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "expense_details.xlsx"
    );

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    xlsx.writeFile(wb, filePath);

    // Download + cleanup
    res.download(filePath, "expense_details.xlsx", (err) => {
      if (err) {
        console.error("Error during file download:", err);
      }

      // ✅ Always delete file after response
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        }
      });
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const billScanner=async (req:any,res:Response)=>{
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    fileToDelete=filePath;
    let extractedText = "";

    // PDF
    if (req.file.mimetype === "application/pdf") {
      extractedText = await extractTextFromPDF(filePath);

      // fallback to OCR if empty
      if (!extractedText || extractedText.trim().length < 20) {
        extractedText = await extractTextFromImage(filePath);
      }
    } 
    // Image
    else {
      extractedText = await extractTextFromImage(filePath);
    }

    if (!extractedText) {
      return res.status(400).json({ message: "Text extraction failed" });
    }
    // console.log(extractedText);
    const structuredData = await parseExpenseWithAI(extractedText);
    
    // console.log(structuredData);

    

    if (!structuredData.amount || structuredData.amount <= 0) {
      return res.status(400).json({ message: "Invalid amount detected" });
    }
    const newExpense = await Expense.create({
      userId: req.user._id,
      amount: structuredData.amount,
      category: structuredData.category,
      icon: categoryIcons[structuredData?.category],
      date: new Date(structuredData.date),
      source: "scanned",
      rawText: extractedText
    });


    return res.status(201).json(newExpense);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Bill scanning failed" });
  }
  finally{
    fs.unlinkSync(fileToDelete); // delete temp file
  }
};