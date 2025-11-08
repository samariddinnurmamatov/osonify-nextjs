"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { getCookie, setCookie, removeCookie } from "@/shared/lib/cookies";
import {
  DEFAULT_THEME,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  type Theme,
} from "@/shared/config/theme/constants";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  defaultTheme: Theme;
  setTheme: (t: Theme) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, _setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return defaultTheme;
    return (getCookie(THEME_COOKIE_NAME) as Theme) ?? defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    const getResolved = (): "light" | "dark" =>
      theme === "system"
        ? matchDark.matches
          ? "dark"
          : "light"
        : (theme as "light" | "dark");

    const currentResolved = getResolved();
    setResolvedTheme(currentResolved);

    const root = document.documentElement;
    const dark = currentResolved === "dark";
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);

    const meta = document.querySelector("meta[name='theme-color']");
    if (meta) meta.setAttribute("content", dark ? "#020817" : "#ffffff");

    const listener = () => {
      if (theme === "system") {
        const system = matchDark.matches ? "dark" : "light";
        setResolvedTheme(system);
        root.classList.toggle("dark", system === "dark");
        root.classList.toggle("light", system === "light");
      }
    };
    matchDark.addEventListener("change", listener);
    return () => matchDark.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((value: Theme) => {
    _setTheme(value);
    if (typeof document !== "undefined") {
      setCookie(THEME_COOKIE_NAME, value, THEME_COOKIE_MAX_AGE);
    }
  }, []);

  const resetTheme = useCallback(() => {
    if (typeof document !== "undefined") {
      removeCookie(THEME_COOKIE_NAME);
    }
    _setTheme(defaultTheme);
  }, [defaultTheme]);

  const ctx = useMemo(
    () => ({ theme, resolvedTheme, setTheme, resetTheme, defaultTheme }),
    [theme, resolvedTheme, setTheme, resetTheme, defaultTheme]
  );

  return (
    <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


