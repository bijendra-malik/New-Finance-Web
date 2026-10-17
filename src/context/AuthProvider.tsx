import { useState } from "react";
import type { ApiUser } from "../api/auth";
import { AuthContext } from "./authContext";

// ── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string, newUser: ApiUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const setLoggedIn = (newUser: ApiUser) => {
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!token || !!user, login, logout, setLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
