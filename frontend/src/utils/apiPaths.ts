export const BASE_URL="http://localhost:3000"
// utils/apiPaths.js
export const API_PATHS= {
  AUTH: {
    LOGIN: "/api/v1/auth/loginUser",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUserInfo",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard/"
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId:string)=>`/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: "/api/v1/income/downloadExcel"
  },
  EXPENSE:{
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    DELETE_EXPENSE: (incomeId:string)=>`/api/v1/expense/${incomeId}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/downloadExcel"
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image"
  }
};