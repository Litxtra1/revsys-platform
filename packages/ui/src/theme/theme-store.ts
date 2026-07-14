"use client";

import { create } from "zustand";
import { THEME_STORAGE_KEY } from "./constants";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedTheme(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export const useThemeStore = create<ThemeState>((set) => ({
  // Dark is the default Command Center experience; light is opt-in via the
  // toggle rather than following the OS preference.
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: (theme) => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyResolvedTheme(resolved);
    set({ theme, resolvedTheme: resolved });
  },
}));
