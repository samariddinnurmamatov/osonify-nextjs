"use client";

import { ReactNode } from "react";
import { useSessionManager } from "../lib";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider
 * Initializes authentication and manages session
 */
export function AuthProvider({ children }: AuthProviderProps) {
  useSessionManager();

  return <>{children}</>;
}

