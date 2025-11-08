/**
 * Browser-side Fetch Utility
 * Handles API calls in client components
 * Uses localStorage for token storage
 */

"use client";

import { createApiClient, RequestOptions, ApiError } from "./api-factory";

const TOKEN_STORAGE_KEY = "auth-tokens";

/**
 * Get access token from client-side storage
 */
function getAccessToken(): string | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      const tokens = JSON.parse(stored);
      return tokens.access_token;
    }
    
    // Fallback to cookie
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    
    return cookieValue;
  } catch {
    return undefined;
  }
}

/**
 * Set auth tokens in client-side storage
 * Note: Cookies set via document.cookie are NOT HttpOnly and cannot be read by SSR
 * They are only used as a fallback for client-side token access
 * For SSR, tokens should be set via server-side cookies().set() in auth-interceptor.server.ts
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  
  try {
    // Primary storage: localStorage (client-side only)
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    );
    
    // Fallback: cookies (client-side only, NOT HttpOnly, NOT accessible in SSR)
    // These are only used as fallback if localStorage is unavailable
    const maxAgeAccess = 60 * 60; // 1 hour
    const maxAgeRefresh = 60 * 60 * 24 * 7; // 7 days
    
    document.cookie = `access_token=${accessToken}; path=/; max-age=${maxAgeAccess}; SameSite=Lax`;
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${maxAgeRefresh}; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to store auth tokens:", error);
  }
}

/**
 * Clear auth tokens from client-side storage
 */
export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `access_token=; path=/; expires=${expires}`;
    document.cookie = `refresh_token=; path=/; expires=${expires}`;
  } catch (error) {
    console.error("Failed to clear auth tokens:", error);
  }
}

/**
 * Browser-side API client
 * Created using factory pattern for DRY
 */
export const browserApi = createApiClient(getAccessToken, false);

// Add token management utilities
(browserApi as typeof browserApi & {
  setAuthTokens: typeof setAuthTokens;
  clearAuthTokens: typeof clearAuthTokens;
}).setAuthTokens = setAuthTokens;
(browserApi as typeof browserApi & {
  setAuthTokens: typeof setAuthTokens;
  clearAuthTokens: typeof clearAuthTokens;
}).clearAuthTokens = clearAuthTokens;

export type { RequestOptions, ApiError };

