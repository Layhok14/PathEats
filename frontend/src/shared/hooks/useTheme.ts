import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "patheat_theme";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggleTheme };
}
