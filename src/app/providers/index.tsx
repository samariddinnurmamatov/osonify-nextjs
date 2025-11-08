"use client";

import React, { Suspense } from "react";
import { ThemeProvider } from "./theme";
import { DirectionProvider } from "./direction";
import { LayoutProvider } from "./layout";
import { FontProvider } from "./font";
import { QueryProvider } from "./query";
import { UserHydrationProvider } from "./hydration";
import { ToastProvider } from "./toast";
import { AuthProvider } from "@/features/auth";

interface AppProvidersProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system";
}

export function AppProviders({ children, defaultTheme }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <DirectionProvider>
        <FontProvider>
          <LayoutProvider>
            <QueryProvider>
              <AuthProvider>
                <ToastProvider>
                  <Suspense fallback={null}>
                    <UserHydrationProvider>{children}</UserHydrationProvider>
                  </Suspense>
                </ToastProvider>
              </AuthProvider>
            </QueryProvider>
          </LayoutProvider>
        </FontProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
