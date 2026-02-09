import AddExpenseForm from '@/components/Expense/AddExpenseForm';
import ExpenseList from '@/components/Expense/ExpenseList';
import ExpenseOverview from '@/components/Expense/ExpenseOverview';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DeleteAlert from '@/components/layouts/DeleteAlert';
import Modal from '@/components/Modal';
import { useUserAuth } from '@/hooks/useUserAuth'
import { API_PATHS } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Expense = () => {
  useUserAuth();

  const [openAddExpenseModal,setOpenAddExpenseModal]=useState(false);
  const [loading,setLoading]=useState(false);
  const [expenseData,setExpenseData]=useState([]);
  const [openDeleteAlert,setOpenDeleteAlert]=useState({
    show: false,
    data: null
  });

  //get all Expense Details
  const fetchExpenseDetails=async()=>{
    if(loading) return;

    setLoading(true);
    try{
      const response=await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);
      if(response.data){
        setExpenseData(response.data);
      }
    }catch(error){
      console.log("Something went wrong. Please Try again. Error: ",error.message);
    }
    finally{
      setLoading(false);
    }
  }

  //Handle Add Expense
  const handleAddExpense= async(expense)=>{
    const {category, amount, date, icon}=expense;

    //Validation Checks
    if(!category.trim()){
      toast.error("Category is required.");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount)<=0){
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if(!date){
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`,{
        category,amount,date,icon
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense added succesfully.");
      
      fetchExpenseDetails();
    } catch (error:any) {
        console.error(
          "Error adding expense: ",
          error.response?.data?.message || error.message
        );
    }
  }

  //Delete Expense
  const deleteExpense=async(id:string)=>{
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false, data:null});
      toast.success("Income details deleted successfully.");
      fetchExpenseDetails();
    } catch (error:any) {
      console.error("Error deleting Expense:",error.response?.data?.message || error.message);
    }
  }

  const handleDownloadExpenseDetails=async()=>{
    try {
      const response=await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
        responseType:"blob"
      });

      //Create URL for the blob
      const url=window.URL.createObjectURL(new Blob([response.data]));
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download","expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Expense details downloaded successfully.");
    } catch (error:any) {
      console.error("Error downloading Expense details:",error.response?.data?.message || error.message);
      toast.error("Failed to download expense details. Please try again later.");
    }
  }

  useEffect(()=>{
    (async ()=>(await fetchExpenseDetails()))();

    return ()=>{};
  },[]);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={()=>setOpenAddExpenseModal(true)}
            />
          </div>
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={()=>setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <ExpenseList
          transactions={expenseData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true, data: id});
          }}
          onDownload={handleDownloadExpenseDetails}
        />

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={()=>setOpenDeleteAlert({show:false,data:null})}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Expense detail?"
            onDelete={()=>deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense