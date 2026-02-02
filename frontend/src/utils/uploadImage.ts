import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const uploadImage=async (profilePic: File)=>{
  const formData=new FormData();
  //append image file to form data
  formData.append("profile-img",profilePic);
  try {
    return await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,
      {
        headers:{
          'Content-Type':"multipart/form-data",
        },
      }
    );
  } catch (error:any) {
    console.error("Error uploading Image: ",error.message);
    throw error; //rethrow for handling
  }
}