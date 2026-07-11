import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import api from "../services/axiosService";
import { authAreaFromPath, getAuthKeys, type AuthArea } from "../utils/authRedirect";

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

function authAreaForRole(role: string | null): AuthArea {
  const upper = String(role || "").toUpperCase();
  if (upper === "CONSUMER") return "user";
  if (upper === "VENDOR") return "vendor";
  return "admin";
}

function setUserStateForArea(area: AuthArea, value: AuthUser | null, setters: Record<AuthArea, (v: AuthUser | null) => void>) {
  setters[area](value);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [consumerUser, setConsumerUser] = useState<AuthUser | null>(() => readUserFromStorage("consumer_user"));
  const [vendorUser, setVendorUser] = useState<AuthUser | null>(() => readUserFromStorage("vendor_user"));
  const [adminUser, setAdminUser] = useState<AuthUser | null>(() => readUserFromStorage("admin_user"));
  const [developerUser, setDeveloperUser] = useState<AuthUser | null>(() => readUserFromStorage("developer_user"));
  const [businessUser, setBusinessUser] = useState<AuthUser | null>(() => readUserFromStorage("business_user"));

  const location = useLocation();
  const area = authAreaFromPath(location.pathname);

  const user = useMemo(() => {
    if (area === "vendor") return vendorUser;
    if (area === "developer") return developerUser;
    if (area === "business") return businessUser;
    if (area === "admin") return adminUser;
    return consumerUser;
  }, [area, consumerUser, vendorUser, adminUser, developerUser, businessUser]);

  const isLoggedIn = !!user;
  const isGuest = area === "user" && !consumerUser;

  useEffect(() => {
    const handleAuthCleared = () => {
      setConsumerUser(readUserFromStorage("consumer_user"));
      setVendorUser(readUserFromStorage("vendor_user"));
      setAdminUser(readUserFromStorage("admin_user"));
      setDeveloperUser(readUserFromStorage("developer_user"));
      setBusinessUser(readUserFromStorage("business_user"));
    };

    window.addEventListener("patheats:auth-cleared", handleAuthCleared);
    return () => window.removeEventListener("patheats:auth-cleared", handleAuthCleared);
  }, []);

  const saveSession = useCallback((session: { user: AuthUser; accessToken: string; refreshToken: string }, targetArea?: AuthArea) => {
    const sessionArea = targetArea ?? authAreaForRole(session.user?.role_scope);
    const keys = getAuthKeys(sessionArea);

    localStorage.setItem(keys.token, session.accessToken);
    localStorage.setItem(keys.refresh, session.refreshToken);
    localStorage.setItem(keys.user, JSON.stringify(session.user));

    const setters = {
      user: setConsumerUser,
      vendor: setVendorUser,
      admin: setAdminUser,
      developer: setDeveloperUser,
      business: setBusinessUser,
    };
    setUserStateForArea(sessionArea, session.user, setters);
  }, []);

  const login = useCallback(async (email: string, password: string, expectedRoles?: string | string[]) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      expectedRoles,
    });
    saveSession(data.data, authAreaFromPath(window.location.pathname));
    return data.data;
  }, [saveSession]);

  const signup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "CONSUMER" });
    saveSession(data.data, "user");
  }, [saveSession]);

  const vendorSignup = useCallback(async (reg: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data } = await api.post("/auth/register", { ...reg, roleScope: "VENDOR" });
    saveSession(data.data, "vendor");
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
    } else if (currentArea === "developer") {
      setDeveloperUser(null);
    } else if (currentArea === "business") {
      setBusinessUser(null);
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
