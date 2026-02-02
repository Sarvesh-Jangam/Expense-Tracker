import AuthLayout from '@/components/layouts/AuthLayout'
import React, { useContext, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Input from '@/components/Inputs/Input';
import { validateEmail } from '@/utils/helper';
import ProfilePhotoSelector from '@/components/Inputs/ProfilePhotoSelector';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATHS } from '@/utils/apiPaths';
import { UserContext } from '@/context/UserContext';
import { uploadImage } from '@/utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic]=useState(null);
  const [fullName,setFullName]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const [password,setPassword]=useState<string>("");

  const [error,setError]=useState<string | null>(null);

  const navigate=useNavigate();
  const {updateUser}=useContext(UserContext);

  //handle signup Form submit
  const handleSignUp=async (event)=>{
    event.preventDefault();

    let profileImageUrl="";
    if(!fullName){
      setError("Enter FullName")
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email.")
      return;
    }
    if(!password){
      setError("Please Enter the password.");
      return;
    }
    setError("");

    //signup api call
    try {
      //Upload image if present
      if(profilePic){
        const imageUploadRes=await uploadImage(profilePic);
        profileImageUrl=imageUploadRes.data.imageUrl;
      }
      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });
      const {user,token}=response.data;
      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error:any) {
      if(error.response && (error.response?.data?.message || error.response.data?.error)){
        setError(error.response.data?.message || error.response.data.error);
      }
      else{
        setError("Something went wrong. Please try again.");
      }
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-full h-auto md-h-full mt-10 md:mt-0 flex flex-col justify-center '>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Join us today by entering your details below.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input 
              value={fullName}
              onChange={({target:{value}})=>{
                setFullName(value);
              }}
              label="Full Name"
              placeholder='John Jones'
              type='text'
            />
            <Input
            value={email}
            onChange={(( event:React.ChangeEvent<HTMLInputElement> )=>{
              setEmail(event.target.value)
            })}
            label="Email Address"
            placeholder="example@email.com"
            type="text"
          />
          <div className="col-span-2">
            <Input
              value={password}
              onChange={(( event:React.ChangeEvent<HTMLInputElement> )=>{
                setPassword(event.target.value)
              })}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </div>
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          
          <button type="submit" className='btn-primary'>SignUp</button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{""}
            <Link className='font-medium text-primary underline' to="/login">LOGIN</Link>

          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp