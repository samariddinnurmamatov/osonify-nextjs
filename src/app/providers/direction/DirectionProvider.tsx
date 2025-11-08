"use client";

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCookie, setCookie, removeCookie } from "@/shared/lib/cookies";

export type Direction = "ltr" | "rtl";

const DIRECTION_COOKIE_NAME = "dir";
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
export const DEFAULT_DIR: Direction = "ltr";

interface DirectionContextType {
  dir: Direction;
  setDir: (v: Direction) => void;
  resetDir: () => void;
  defaultDir: Direction;
}

const DirectionContext = createContext<DirectionContextType | null>(null);

export function DirectionProvider({
  children,
  defaultDir = DEFAULT_DIR,
}: {
  children: ReactNode;
  defaultDir?: Direction;
}) {
  const [dir, _setDir] = useState<Direction>(() => {
    if (typeof document === "undefined") return defaultDir;
    return (getCookie(DIRECTION_COOKIE_NAME) as Direction) ?? defaultDir;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("dir") !== dir) {
      root.setAttribute("dir", dir);
    }
  }, [dir]);

  const setDir = useCallback((v: Direction) => {
    _setDir(v);
    setCookie(DIRECTION_COOKIE_NAME, v, DIRECTION_COOKIE_MAX_AGE);
  }, []);

  const resetDir = useCallback(() => {
    removeCookie(DIRECTION_COOKIE_NAME);
    _setDir(defaultDir);
  }, [defaultDir]);

  const value = useMemo(
    () => ({ dir, setDir, resetDir, defaultDir }),
    [dir, setDir, resetDir, defaultDir]
  );

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const ctx = useContext(DirectionContext);
  if (!ctx)
    throw new Error("useDirection must be used within a DirectionProvider");
  return ctx;
}


