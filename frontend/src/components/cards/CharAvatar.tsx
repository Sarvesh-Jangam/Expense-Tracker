import React from 'react'

const CharAvatar = ({fullName, width, height, style}) => {
  const getInitals=(fullName:string)=>{
    if(!fullName) return "";
    const [firstName,lastName]=fullName.split(" ");
    return ((firstName?firstName[0]:"")+(lastName?lastName[0]:"")).toUpperCase();
  }
  return (
    <div className={`${width || 'w-12'} ${height || 'h-12'} ${style || 'flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100'}`}>
      {getInitals(fullName || "")}
    </div>
  )
}

export default CharAvatar