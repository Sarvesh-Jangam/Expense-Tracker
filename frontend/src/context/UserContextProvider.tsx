import React, {createContext, useState, ReactNode} from "react";
import { UserContext } from "./UserContext";

interface UserProviderProps {
  children: ReactNode;
}


const UserProvider=({children}:UserProviderProps)=>{
  const [user, setUser]=useState<any>(null);


  //Function to update user data
  const updateUser=(userData)=>{
    setUser(userData);
  }

  // Function to clear user data
  const clearUser=()=>{
    setUser(null);
  }

  return (
    <UserContext.Provider value={{user, updateUser, clearUser}}>
    {children}
    </UserContext.Provider>
  )
}

export default UserProvider;
