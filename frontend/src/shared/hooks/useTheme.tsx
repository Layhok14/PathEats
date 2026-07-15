// Theme context — light/dark mode.
// Dark mode only applies to /user/* routes. Admin/vendor/CS/dev stay light.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useLocation } from "react-router";
import api from "../services/axiosService";
import { useAuth } from "./useAuth";

export const DARK_THEME = {
  appBg: "#0F172A", sidebar: "#1E293B", navBg: "#0F172A",
  border: "rgba(255,255,255,0.08)",
  surface1: "rgba(255,255,255,0.03)", surface2: "rgba(255,255,255,0.06)", surface3: "rgba(255,255,255,0.09)",
  inputBg: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.1)", inputFocus: "rgba(34,197,94,0.5)",
  text1: "rgba(255,255,255,0.92)", text2: "rgba(255,255,255,0.68)", text3: "rgba(255,255,255,0.42)",
  text4: "rgba(255,255,255,0.28)", text5: "rgba(255,255,255,0.16)",
  glass: "rgba(15,23,42,0.88)", glassCard: "rgba(15,23,42,0.95)",
  dropdown: "#1E293B", dropdownBorder: "rgba(255,255,255,0.1)",
  filterChip: "rgba(255,255,255,0.07)", filterChipText: "rgba(255,255,255,0.5)",
  primary: "#22c55e", primaryText: "#0f2d1a",
};

export const LIGHT_THEME = {
  appBg: "#F8F9FF", sidebar: "#F0FDF4", navBg: "#006E2F",
  border: "#D1D5DB",
  surface1: "#F0FDF4", surface2: "#FFFFFF", surface3: "#D1D5DB",
  inputBg: "#FFFFFF", inputBorder: "#D1D5DB", inputFocus: "#22C55E",
  text1: "#0F172A", text2: "#3F465C", text3: "#5C647A",
  text4: "#5C647A", text5: "#BEC6E0",
  glass: "rgba(248,249,255,0.92)", glassCard: "rgba(255,255,255,0.98)",
  dropdown: "#FFFFFF", dropdownBorder: "#D1D5DB",
  filterChip: "#F0FDF4", filterChipText: "#3F465C",
  primary: "#22C55E", primaryText: "#ffffff",
};

type ThemeTokens = typeof LIGHT_THEME;

interface ThemeContextValue {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  tm: ThemeTokens;
  isUserRoute: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const darkModeRef = useRef(false);
  const location = useLocation();
  const { user } = useAuth();
  const isUserRoute = location.pathname.startsWith("/user");
  const isAuthenticatedConsumer = user?.role_scope === "CONSUMER";

  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    if (!isUserRoute || !isAuthenticatedConsumer) return;

    let active = true;
    api.get("/user/preferences")
      .then((response) => {
        if (!active) return;
        const prefersDarkMode = response.data.data?.theme === "dark";
        darkModeRef.current = prefersDarkMode;
        setDarkModeState(prefersDarkMode);
      })
      .catch((error) => {
        console.error("[useTheme] Failed to load saved theme:", error);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticatedConsumer, isUserRoute, user?.id]);

  const setDarkMode = useCallback<Dispatch<SetStateAction<boolean>>>((valueOrUpdater) => {
    const nextDarkMode = typeof valueOrUpdater === "function"
      ? valueOrUpdater(darkModeRef.current)
      : Boolean(valueOrUpdater);

    darkModeRef.current = nextDarkMode;
    setDarkModeState(nextDarkMode);

    if (isUserRoute && isAuthenticatedConsumer) {
      api.put("/user/preferences", { theme: nextDarkMode ? "dark" : "light" })
        .catch((error) => {
          console.error("[useTheme] Failed to save theme:", error);
        });
    }
  }, [isAuthenticatedConsumer, isUserRoute]);

  // Apply .dark class to <html> only on user routes
  useEffect(() => {
    if (isUserRoute && darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isUserRoute, darkMode]);

  // Force light mode on non-user routes
  const effectiveDark = isUserRoute ? darkMode : false;
  const tm = effectiveDark ? DARK_THEME : LIGHT_THEME;

  const ctxValue = useMemo(() => ({ darkMode: effectiveDark, setDarkMode, tm, isUserRoute }), [effectiveDark, setDarkMode, tm, isUserRoute]);

  return (
    <ThemeContext.Provider value={ctxValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
