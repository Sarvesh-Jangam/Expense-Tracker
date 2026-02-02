import { createContext } from "react";

interface UserContextType {
  user: any;
  updateUser: (userData: any) => void;
  clearUser: () => void;
}
export const UserContext=createContext<UserContextType | null>(null);