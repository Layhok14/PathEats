import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/axiosService";
import { clearAuthStorage } from "../utils/authRedirect";
import { getApiErrorMessage } from "../utils/apiError";

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
  login: (email: string, password: string, expectedRoles?: string | string[]) => Promise<void>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  vendorSignup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id === "dev-vendor-id") {
          localStorage.removeItem("auth_user");
          return null;
        }
        return parsed;
      }
    } catch (err) { console.error("[useAuth] Failed to parse stored user:", err); }
    return null;
  });
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    if (user) setIsGuest(false);
  }, [user]);

  useEffect(() => {
    const handleAuthCleared = () => {
      setUser(null);
      setIsGuest(true);
    };

    window.addEventListener("patheats:auth-cleared", handleAuthCleared);
    return () => window.removeEventListener("patheats:auth-cleared", handleAuthCleared);
  }, []);

  const saveSession = useCallback((session: { user: AuthUser; accessToken: string; refreshToken: string }) => {
    localStorage.setItem("auth_token", session.accessToken);
    localStorage.setItem("auth_refresh_token", session.refreshToken);
    localStorage.setItem("auth_user", JSON.stringify(session.user));
    setUser(session.user);
    setIsGuest(false);
  }, []);

  const login = useCallback(async (email: string, password: string, expectedRoles?: string | string[]) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
        expectedRoles,
      });
      saveSession(data.data);
    } catch (err: any) {
      throw new Error(getApiErrorMessage(err, "Login failed."));
    }
  }, [saveSession]);

  const signup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "CONSUMER" });
    saveSession(data.data);
  }, [saveSession]);

  const vendorSignup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "VENDOR" });
    saveSession(data.data);
  }, [saveSession]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("auth_refresh_token");
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken });
    } catch { /* ignore */ }
    clearAuthStorage();
    setUser(null);
    setIsGuest(true);
  }, []);

  const continueAsGuest = useCallback(() => {
    clearAuthStorage();
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
