import { Income } from "../models/Income";
import { Expense } from "../models/Expense";
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/User";

//add Expense
export const getDashboardData=async (req:any,res: any)=>{
  try {
    const userId=req.user.id;
    const userObjectId=new mongoose.Types.ObjectId(String(userId));
    
    //  Fetch Total Income
    const totalIncome= await Income.aggregate([
      {
        $match: {userId:userObjectId}
      },
      {
        $group: {_id:null,total: {$sum:"$amount"}}
      }
    ]);
    // console.log(totalIncome[0]);
    // console.log(`isValidObject: ${isValidObjectId(userId)}`);

    const totalExpense=await Expense.aggregate([
      {$match: {userId: userObjectId}},
      {$group: {_id:null,total:{$sum:"$amount"}}}
    ]);
    // console.log(totalExpense[0]);
    //get income transactions in last 60 days
    const last60DaysIncomeTransactions=await Income.find({
      userId,
      date:{$gte: new Date(Date.now()-60*24*60*60*1000)}
    }).sort({date:-1});

    //get TotalIncome for last 60 days
    const incomeLast60Days=last60DaysIncomeTransactions.reduce((total:number,i)=>total+=i.amount,0);

    // get expense transaction in las 30days
    const last30DaysExpenseTransaction=await Expense.find({
      userId:userObjectId,
      date:{$gte: new Date(Date.now()-30*24*60*60*1000)}
    }).sort({date:-1});

    //get totalExpenses for last 30 days
    const expenseLast30Days=last30DaysExpenseTransaction.reduce((sum:number,i)=>(sum+=i.amount),0);

    //fetch last 5 transactions (income+expenses)
    const last5Transactions=[
      ...(await Income.find({userId}).sort({date:-1}).limit(5)).map((transaction)=>({
        ...transaction.toObject(),
        type:"Income",
      })),
      ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map((transaction)=>({
        ...transaction.toObject(),
        type:"Expense",
      }))
    ].sort((a:any,b:any)=>b.date-a.date);

    //final Response
    res.status(200).json({
      totalBalance:(totalIncome[0]?.total || 0)-(totalExpense[0]?.total || 0),
      totalExpense:totalExpense[0]?.total,
      totalIncome:totalIncome[0]?.total,
      last30DaysExpenses:{
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransaction
      },
      last60DaysIncome:{
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions
      },
      recentTransactions: last5Transactions
    });

  } catch (error:any) {
    res.status(400).json({message: "Error fetching dashboard data",error:error.message});
  }
}