import { createContext, useContext } from "react";
import type { ApiUser } from "../api/auth";

/**
 * What the signed-in session is allowed to see in the shared navigation:
 *
 * - `signed-out` — everyone may browse loans and the franchise page.
 * - `customer`   — the loan apply flow, but not the franchise nav.
 * - `franchise`  — the franchise nav, but not the loan apply flow.
 */
export type AuthVisibility = "signed-out" | "customer" | "franchise";

export interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoggedIn: boolean;
  /** Derived from `user`, so it updates the moment a login/logout lands. */
  authVisibility: AuthVisibility;
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
