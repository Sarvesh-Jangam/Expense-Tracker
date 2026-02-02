import React, { useEffect } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useUserAuth } from '@/hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';

const Home = () => {
  useUserAuth();

  const navigate=useNavigate();
  const [dashboardData,setDashboardData]=useState(null);
  const [loading,setLoading]=useState(false);
  const fetchDashboardData=async ()=>{
    if(loading) return;
    setLoading(true);

    try {
      const response= await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if(response.data){
        setDashboardData(response.data);
      }
    } catch (error:any) {
      console.error("Something went wrong, ",error.message);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchDashboardData();
    return ()=>{

    }
  },[])

  return (
    <div>
      <DashboardLayout activeMenu="Dashboard">
        <div className='my-5 mx-auto'>
          
        </div>
      </DashboardLayout>
    </div>
  )
}

export default Home