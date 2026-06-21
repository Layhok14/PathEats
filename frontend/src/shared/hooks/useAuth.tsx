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
  isGuest: boolean;
  showAuthGate: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  vendorSignup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "patheat_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return null;
  });
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const session = data.data;
    const u: AuthUser = {
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      role_scope: session.user.role_scope,
    };
    localStorage.setItem("auth_token", session.token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
    setIsGuest(false);
  }, []);

  const signup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "CONSUMER" });
    const session = data.data;
    const u: AuthUser = {
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      role_scope: session.user.role_scope,
    };
    localStorage.setItem("auth_token", session.token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
    setIsGuest(false);
  }, []);

  const vendorSignup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "VENDOR" });
    const session = data.data;
    const u: AuthUser = {
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      role_scope: session.user.role_scope,
    };
    localStorage.setItem("auth_token", session.token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
    setIsGuest(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    setUser(null);
  }, []);

  const showAuthGate = !user && !isGuest;

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
    isGuest,
    showAuthGate,
    login,
    signup,
    vendorSignup,
    logout,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
