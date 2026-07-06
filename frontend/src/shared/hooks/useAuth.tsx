import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import api from "../services/axiosService";
import { authAreaFromPath, getAuthKeys } from "../utils/authRedirect";
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
  login: (email: string, password: string, expectedRoles?: string | string[]) => Promise<any>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  vendorSignup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserFromStorage(key: string): AuthUser | null {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as AuthUser;
  } catch (err) { console.error("[useAuth] Failed to parse stored user:", err); }
  return null;
}

function setUserStateForRole(role: string | null, value: AuthUser | null, setters: Record<string, (v: AuthUser | null) => void>) {
  if (!role) return;
  const upper = role.toUpperCase();
  if (upper === "CONSUMER") setters.consumer(value);
  else if (upper === "VENDOR") setters.vendor(value);
  else setters.admin(value);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [consumerUser, setConsumerUser] = useState<AuthUser | null>(() => readUserFromStorage("consumer_user"));
  const [vendorUser, setVendorUser] = useState<AuthUser | null>(() => readUserFromStorage("vendor_user"));
  const [adminUser, setAdminUser] = useState<AuthUser | null>(() => readUserFromStorage("admin_user"));

  const location = useLocation();
  const area = authAreaFromPath(location.pathname);

  const user = useMemo(() => {
    if (area === "vendor") return vendorUser;
    if (area === "admin") return adminUser;
    return consumerUser;
  }, [area, consumerUser, vendorUser, adminUser]);

  const isLoggedIn = !!user;
  const isGuest = area === "user" && !consumerUser;

  useEffect(() => {
    const handleAuthCleared = () => {
      setConsumerUser(readUserFromStorage("consumer_user"));
      setVendorUser(readUserFromStorage("vendor_user"));
      setAdminUser(readUserFromStorage("admin_user"));
    };

    window.addEventListener("patheats:auth-cleared", handleAuthCleared);
    return () => window.removeEventListener("patheats:auth-cleared", handleAuthCleared);
  }, []);

  const saveSession = useCallback((session: { user: AuthUser; accessToken: string; refreshToken: string }) => {
    const role = session.user?.role_scope ?? "";
    const prefix = role === "CONSUMER" ? "consumer" : role === "VENDOR" ? "vendor" : "admin";
    const keys = getAuthKeys(prefix === "consumer" ? "user" : prefix === "vendor" ? "vendor" : "admin");

    localStorage.setItem(keys.token, session.accessToken);
    localStorage.setItem(keys.refresh, session.refreshToken);
    localStorage.setItem(keys.user, JSON.stringify(session.user));

    const setters = { consumer: setConsumerUser, vendor: setVendorUser, admin: setAdminUser };
    setUserStateForRole(role, session.user, setters);
  }, []);

  const login = useCallback(async (email: string, password: string, expectedRoles?: string | string[]) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      expectedRoles,
    });
    saveSession(data.data);
    return data.data;
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
    const currentArea = authAreaFromPath(window.location.pathname);
    const keys = getAuthKeys(currentArea);

    const refreshToken = localStorage.getItem(keys.refresh);
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken });
    } catch { /* logout best-effort */ }

    localStorage.removeItem(keys.token);
    localStorage.removeItem(keys.refresh);
    localStorage.removeItem(keys.user);

    if (currentArea === "user") {
      setConsumerUser(null);
    } else if (currentArea === "vendor") {
      setVendorUser(null);
    } else {
      setAdminUser(null);
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    const keys = getAuthKeys("user");
    localStorage.removeItem(keys.token);
    localStorage.removeItem(keys.refresh);
    localStorage.removeItem(keys.user);
    setConsumerUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoggedIn,
    isGuest,
    login,
    signup,
    vendorSignup,
    logout,
    continueAsGuest,
  }), [user, isLoggedIn, isGuest, login, signup, vendorSignup, logout, continueAsGuest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
