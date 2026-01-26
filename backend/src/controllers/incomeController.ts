import { User } from "../models/User"
import { Income } from "../models/Income"
import xlsx from "xlsx";
import { Response, response } from "express";
import path from "path";
// Add income source
export const addIncome=async (req: any,res: any)=>{
  const userId=req.user.id;

  try{
    const {source,amount,date} =req.body;
    if(!source || !amount || !date){
      res.status(400).json({message: "Input all the required fields."});
    }

    const newIncome=new Income({
      userId,
      source,
      amount,
      date: new Date(date).toLocaleString('en-In')
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  }
  catch(error){
    res.status(404).json({message:"Error in saving the newIncome.",error});
  }
}
// Get all income source
export const getAllIncome=async (req:any,res:any)=>{
  const userId=req.user.id;

  try {
    // const incomes=await User.aggregate([
    //   // {
    //   //   $match:{}
    //   // },
    //   {
    //     $lookup:{
    //       from:"incomes",
    //       localField: "_id",
    //       foreignField: "userId",
    //       as: "Incomes"
    //     }
    //   },
    //   {
    //     $project:{
    //       Incomes: 1
    //     }
    //   }
    // ]);
    const incomes=await Income.find({userId}).sort({date:-1});
    res.status(200).json(incomes);
  } catch (error:any) {
    res.status(400).json({message:"Error fetching all incomes.",error: error.message});
  }
}
// delete a income source
export const deleteIncome=async (req:any,res:any)=>{
  try {
    await Income.findByIdAndDelete(req.params?.id);
    res.json({message: "Income deleted successfully."});
  } catch (error) {
    res.status(500).json({message: "server error."});
  }
}
// download income excel
export const downloadIncomeExcel=async (req:any,res:Response)=>{
  const userId=req.user.id;
  try {
    const income=await Income.find({userId}).sort({date:-1});

    //prepare data for excel
    const data=income.map((i)=>({
        Source: i.source,
        Amount: i.amount,
        Date: i.date,
      })
    );
    const wb=xlsx.utils.book_new();
    const ws=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Income");
    xlsx.writeFile(wb,path.join(process.cwd(),"uploads","income_details.xlsx"));
    res.download(path.join(process.cwd(),"uploads","income_details.xlsx"));
  } catch (error:any) {
    res.status(500).json({message: "Server Error",error:error.message});
  }
}

  