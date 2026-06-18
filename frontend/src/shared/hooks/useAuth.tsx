import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../services/axiosService";

const SESSION_KEY = "patheat_user";

interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_scope: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { firstName: string; lastName: string; email: string; password?: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    const { user: account, token } = response.data.data;
    setUser({ ...account, token });
  }

  async function signup({ firstName, lastName, email, password = "ChangeMe123!", phone }: { firstName: string; lastName: string; email: string; password?: string; phone?: string }) {
    const response = await api.post("/auth/register", { firstName, lastName, email, password, phone });
    const { user: account, token } = response.data.data;
    setUser({ ...account, token });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
