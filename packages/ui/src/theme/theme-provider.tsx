"use client";

import { useEffect } from "react";
import { useThemeStore, type Theme } from "./theme-store";
import { THEME_STORAGE_KEY } from "./constants";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const initial: Theme =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setTheme(initial);
    // Runs once on mount to hydrate the store from localStorage; setTheme is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme !== "system") return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme("system");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme, setTheme]);

  return <>{children}</>;
}
