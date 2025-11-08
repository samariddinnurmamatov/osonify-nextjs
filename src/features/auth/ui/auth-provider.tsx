"use client";

import { ReactNode, useEffect } from "react";
import { useSessionManager } from "../lib";
import { useAuthStore } from "../model";

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

