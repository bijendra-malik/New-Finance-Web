import React, { createContext, useState, useEffect } from "react";
import type { ApiUser } from "../api/auth";
import { fetchProfile } from "../api/auth";

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ApiUser | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? (JSON.parse(stored) as ApiUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // On mount — if token exists, re-validate by fetching profile
  useEffect(() => {
    if (token && !user) {
      fetchProfile()
        .then((res) => {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        })
        .catch(() => {
          // Token is invalid or expired — clear everything
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const login = (newToken: string, newUser: ApiUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const refreshProfile = async () => {
    const res = await fetchProfile();
    setUser(res.user);
    localStorage.setItem("user", JSON.stringify(res.user));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!token, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
