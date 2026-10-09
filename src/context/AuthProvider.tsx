import { useEffect, useMemo, useState } from "react";
import type { ApiUser } from "../api/auth";
import { fetchProfile } from "../api/auth";
import type { ProfileResponse } from "../api/auth";
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

  // On mount — if token exists, re-validate by fetching profile
  useEffect(() => {
    if (token && !user) {
      fetchProfile()
        .then((res: ProfileResponse) => {
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
    // Runs once on mount; login/logout below always use the latest state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const res: ProfileResponse = await fetchProfile();
    setUser(res.user);
    localStorage.setItem("user", JSON.stringify(res.user));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!token, authVisibility, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
