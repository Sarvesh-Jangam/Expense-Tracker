import React, { useMemo } from 'react'
import CustomPieChart from './CustomPieChart'

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"]

const RecentIncomeWithChart = ({ data = [], totalIncome }) => {
  const chartData = useMemo(() => {
    return Object.values(
      data.reduce((acc, item) => {
        const key = item?.source;
        if (!key) return acc;

        acc[key] ??= { name: key, amount: 0 };
        acc[key].amount += Number(item?.amount || 0);

        return acc;
      }, {})
    );
  }, [data]);

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart 
        data={chartData}
        label="Total Income"
        totalAmount={`${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
