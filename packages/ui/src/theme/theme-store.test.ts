import { beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "./theme-store";
import { THEME_STORAGE_KEY } from "./constants";

function getState() {
  return useThemeStore.getState();
}

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ theme: "system", resolvedTheme: "light" });
  });

  it("setTheme('dark') updates state, persists it, and adds the dark class", () => {
    getState().setTheme("dark");

    expect(getState().theme).toBe("dark");
    expect(getState().resolvedTheme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("setTheme('light') removes the dark class", () => {
    getState().setTheme("dark");
    getState().setTheme("light");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(getState().resolvedTheme).toBe("light");
  });
});
