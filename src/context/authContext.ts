import { createContext, useContext } from "react";
import type { ApiUser } from "../api/auth";

export interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
