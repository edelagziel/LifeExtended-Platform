import { createContext, ReactNode } from "react";
import { useLocalStorage } from "../customHooks/useLocalStorage";

interface UserContextType {
  isAuthenticated: boolean;
  isProfileFilled: boolean;
  email: string | null;

  setIsAuthenticated: (value: boolean) => void;
  setIsProfileFilled: (value: boolean) => void;
  setEmail: (value: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    "isAuthenticated",
    false
  );

  const [isProfileFilled, setIsProfileFilled] = useLocalStorage<boolean>(
    "isProfileFilled",
    false
  );

  const [email, setEmail] = useLocalStorage<string | null>(
    "userEmail",
    null
  );

  const value: UserContextType = {
    isAuthenticated,
    isProfileFilled,
    email,
    setIsAuthenticated,
    setIsProfileFilled,
    setEmail,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
