import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash} from "react-icons/fa6"

type inputProps={
  value:string;
  onChange:(event: React.ChangeEvent<HTMLInputElement>) => void;
  label:string;
  placeholder?:string;
  type?:string;
}

const Input = ({value, onChange, label, placeholder, type}:inputProps) => {
  const [showPassword,setShowPassword]=useState(false);
  const toggleShowPassword=()=>{
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className='text-[13px] text-shadow-slate-800'>{label}</label>
      <div className='input-box'>
        <input
          id={label}
          name={label}
          type={type=='password'?(showPassword?'text':'password'): type}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none text-sm md:text-base h-10'
          value={value}
          onChange={(e)=>onChange(e)}
          // onChange={onChange}
        />

        {type=='password' && (
          <>
            {showPassword?
            <FaRegEye 
              size={22}
              className='text-primary cursor-pointer'
              onClick={()=>toggleShowPassword()}
            />
            :<FaRegEyeSlash 
              size={22}
              className='text-slate-400 cursor-pointer'
              onClick={()=>toggleShowPassword()}
            />
            }
          </>
        )}
        
      </div>
    </div>
  )
}

export default Input