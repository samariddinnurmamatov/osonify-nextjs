"use client";

import { useEffect } from "react";
import { useTheme } from "@/app/providers/theme/ThemeProvider";

export function useThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Keep meta theme-color in sync (can be removed if handled elsewhere)
  useEffect(() => {
    const resolved =
      theme === "system"
        ? resolvedTheme === "dark"
          ? "#020817"
          : "#ffffff"
        : theme === "dark"
        ? "#020817"
        : "#ffffff";

    const meta = document.querySelector("meta[name='theme-color']");
    if (meta) meta.setAttribute("content", resolved);
  }, [theme, resolvedTheme]);

  return { theme, setTheme } as const;
}


