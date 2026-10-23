import { useCallback, useEffect, useState } from "react";
import type { ApiUser } from "../api/auth";
import { AuthContext } from "./authContext";
import { onAuthCleared } from "../utils/authEvents";
import { resetSessionCaches } from "../utils/sessionReset";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const readStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const readStoredUser = (): ApiUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApiUser;
    return parsed?._id ? parsed : null;
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors so a full browser does not break the session
  }
};

const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors so a full browser does not break the session
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);

  const login = useCallback((newToken: string, newUser: ApiUser) => {
    resetSessionCaches();
    setToken(newToken);
    setUser(newUser);
    writeStorage(TOKEN_KEY, newToken);
    writeStorage(USER_KEY, JSON.stringify(newUser));
  }, []);

  const setLoggedIn = useCallback((newUser: ApiUser) => {
    setUser(newUser);
    writeStorage(USER_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeStorage(TOKEN_KEY);
    removeStorage(USER_KEY);
    resetSessionCaches();
  }, []);

  useEffect(() => onAuthCleared(logout), [logout]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!token || !!user, login, logout, setLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
