"use client";

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { getCookie, setCookie } from "@/shared/lib/cookies";

export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "layout_collapsible";
const LAYOUT_VARIANT_COOKIE_NAME = "layout_variant";
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const DEFAULT_VARIANT: Variant = "sidebar";
export const DEFAULT_COLLAPSIBLE: Collapsible = "icon";

interface LayoutContextType {
  collapsible: Collapsible;
  setCollapsible: (v: Collapsible) => void;
  variant: Variant;
  setVariant: (v: Variant) => void;
  resetLayout: () => void;
  defaultVariant: Variant;
  defaultCollapsible: Collapsible;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    if (typeof document === "undefined") return DEFAULT_COLLAPSIBLE;
    return (
      (getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME) as Collapsible) ??
      DEFAULT_COLLAPSIBLE
    );
  });

  const [variant, _setVariant] = useState<Variant>(() => {
    if (typeof document === "undefined") return DEFAULT_VARIANT;
    return (
      (getCookie(LAYOUT_VARIANT_COOKIE_NAME) as Variant) ?? DEFAULT_VARIANT
    );
  });

  const setCollapsible = useCallback((value: Collapsible) => {
    _setCollapsible(value);
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, value, LAYOUT_COOKIE_MAX_AGE);
  }, []);

  const setVariant = useCallback((value: Variant) => {
    _setVariant(value);
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, value, LAYOUT_COOKIE_MAX_AGE);
  }, []);

  const resetLayout = useCallback(() => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
  }, [setCollapsible, setVariant]);

  const value = useMemo<LayoutContextType>(
    () => ({
      collapsible,
      setCollapsible,
      variant,
      setVariant,
      resetLayout,
      defaultVariant: DEFAULT_VARIANT,
      defaultCollapsible: DEFAULT_COLLAPSIBLE,
    }),
    [collapsible, variant, setCollapsible, setVariant, resetLayout]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}


