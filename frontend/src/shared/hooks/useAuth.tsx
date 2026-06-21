// Auth context — single source for session state across all domains.
// Switched from mock data to real API calls via axios.

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axiosService";

const AuthContext = createContext(null);

const SESSION_KEY = "patheat_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    const session = data.data;
    setUser({
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      role_scope: session.user.role_scope,
      token: session.token,
    });
    setIsGuest(false);
  }

  async function signup({ firstName, lastName, email, password }) {
    // Default to CONSUMER for user signup; vendor signup should use roleScope: "VENDOR"
    const { data } = await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
      roleScope: "CONSUMER",
    });
    const session = data.data;
    setUser({
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      role_scope: session.user.role_scope,
      token: session.token,
    });
    setIsGuest(false);
  }

  async function continueAsGuest() { setIsGuest(true); setUser(null); }

  async function vendorSignup({ firstName, lastName, email, password }) {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
      roleScope: "VENDOR",
    });
    const session = data.data;
    setUser({
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      role_scope: session.user.role_scope,
      token: session.token,
    });
  }

  function logout() { setUser(null); }

  // showAuthGate: true when the user hasn't authenticated or chosen guest
  const showAuthGate = !user && !isGuest;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isGuest, showAuthGate,continueAsGuest, login, signup, vendorSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
