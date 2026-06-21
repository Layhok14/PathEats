import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/axiosService";

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role_scope: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  vendorSignup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const stored = localStorage.getItem("auth_user");
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { user: u, token } = data.data;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const signup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "CONSUMER" });
    const { user: u, token } = data.data;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const vendorSignup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "VENDOR" });
    const { user: u, token } = data.data;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
    login,
    signup,
    vendorSignup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
