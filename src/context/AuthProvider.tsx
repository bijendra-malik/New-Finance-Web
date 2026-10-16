import { useEffect, useMemo, useState } from "react";
import type { ApiUser } from "../api/auth";
import { AuthContext } from "./authContext";
import type { AuthVisibility } from "./authContext";

// ── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  /**
   * Derived from the live session, so a login or logout re-renders every
   * subscriber (header nav, apply buttons) without a page reload.
   * The API's `role` is free-form, so match it case-insensitively.
   */
  const authVisibility: AuthVisibility = useMemo(() => {
    const role = typeof user?.role === "string" ? user.role.trim().toLowerCase() : "";
    if (role === "franchise") return "franchise";
    if (role === "customer") return "customer";
    return "signed-out";
  }, [user]);

  // On mount — the provider no longer re-fetches the profile.
  // The signed‑in user record is the authoritative source for every loan‑apply submission.
  useEffect(() => {
    // nothing more to do; profile is kept in localStorage from the initial sign-in
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

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!token, authVisibility, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

