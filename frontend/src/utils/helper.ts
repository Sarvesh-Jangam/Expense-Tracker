import moment from "moment";

export const validateEmail=(email:string)=>{
  const regex=/^\S+@\S+\.\S+$/;
  return regex.test(email);
}

export const addThousandsSeparator=(num:number)=>{
  if(num==null || isNaN(num)) return "";

  const [integerPart, fractionPart]= num.toString().split('.');
  const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionPart?`₹ ${formattedInteger}.${fractionPart}`:`₹ ${formattedInteger}`;
}

// export const prepareExpenseBarChartData=(data=[])=>{
//   const chartData=data.map((item)=>(
//     {
//     month:moment(item?.date).format("Do MMM"),
//     category:item?.category,
//     amount:item?.amount,
//     }
//   ))

//   return chartData;
//   // return Object.values(
//   //   chartData.reduce((acc, item) => {
//   //     const key = item?.category;
//   //     if (!key) return acc;

//   //     acc[key] ??= { name: key, amount: 0 };
//   //     acc[key].amount += Number(item?.amount || 0);

//   //     return acc;
//   //   }, {})
//   // );
// }

// export const prepareExpenseLineChartData=(data=[])=>{
//   const sortedData=[...data].sort((a,b)=> new Date(a.date)- new Date(b.date));
//   const chartData=sortedData.map((item)=>({
//     month: moment(item?.date).format("Do MMM YYYY"),
//     amount: item?.amount,
//     category: item?.category,
//   }));
//   console.log(chartData);
//   return chartData;
// }

export const prepareExpenseBarChartData = (data = []) => {
const grouped = {};
  data=[...data].sort((a,b)=> new Date(a.date)- new Date(b.date));
  data.forEach((item) => {
    const day = moment(item.date).format("Do MMM YYYY");

    if (!grouped[day]) {
      grouped[day] = {
        month: day,
        amount: 0,
        categories: new Set(),
      };
    }

    grouped[day].amount += Number(item.amount) || 0;
    grouped[day].categories.add(item.category);
  });

  return Object.values(grouped).map((item) => ({
    month: item.month,
    amount: item.amount,
    category: [...item.categories].join(", "),
  }));
};

export const prepareIncomeBarChartData=(data=[])=>{
  const sortedData=[...data].sort((a,b)=> new Date(a.date)- new Date(b.date));
  const grouped={};
  sortedData.forEach((item)=>{
    const day=moment(item.date).format("Do MMM YYYY");

    if(!grouped[day]){
      grouped[day]={
        month: day,
        amount: 0,
        source: new Set(),
      }
    }

    grouped[day].amount += Number(item.amount) || 0;
    grouped[day].source.add(item.source);
  });

  
   return Object.values(grouped).map((item) => ({
    month: item.month,
    amount: item.amount,
    source: [...item.source].join(", "),
  }));
}

export const prepareExpenseLineChartData = (data = []) => {
  const grouped = {};
  data=[...data].sort((a,b)=> new Date(a.date)- new Date(b.date));
  data.forEach((item) => {
    const day = moment(item.date).format("Do MMM YYYY");

    if (!grouped[day]) {
      grouped[day] = {
        month: day,
        amount: 0,
        categories: new Set(),
      };
    }

    grouped[day].amount += Number(item.amount) || 0;
    grouped[day].categories.add(item.category);
  });

  return Object.values(grouped).map((item) => ({
    month: item.month,
    amount: item.amount,
    category: [...item.categories].join(", "),
  }));
};
