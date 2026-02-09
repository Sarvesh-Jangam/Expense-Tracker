import { prepareExpenseBarChartData } from "@/utils/helper";
import React, { useEffect, useState } from "react"
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses = ({data}) => {

  const [chartData,setChartData]=useState([]);

  useEffect(()=>{
    const result=prepareExpenseBarChartData(data);
    setChartData(result);

    return ()=>{};
  },[data])
// console.log(chartData)
  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>
      <CustomBarChart data={chartData} />
    </div>
  )
}

export default Last30DaysExpenses