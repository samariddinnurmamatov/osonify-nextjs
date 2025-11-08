/**
 * Auth Interceptor - Server Side
 * Server-side token management utilities
 * Tree-shakeable - only included in server bundle
 */

import { cookies } from "next/headers";
import type { AuthResponse } from "../types/auth.types";

const TOKEN_COOKIE_NAME = "access_token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

/**
 * Handle login success - store tokens in cookies (server-side)
 */
export async function handleLoginSuccess(authResponse: AuthResponse): Promise<void> {
  const cookieStore = await cookies();
  
  // Set access token cookie (1 hour)
  cookieStore.set(TOKEN_COOKIE_NAME, authResponse.token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
  
  // Set refresh token cookie (7 days)
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, authResponse.token.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Handle logout - clear tokens from cookies (server-side)
 */
export async function handleLogout(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete(TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * Authenticated fetch wrapper (server-side)
 * Note: Server-side refresh is handled in server-fetch.ts
 * This is just a placeholder for type consistency
 */
export async function authenticatedFetch<TResponse, TBody = unknown>(
  path: string,
  options: any = {}
): Promise<TResponse> {
  // Server-side refresh is handled in server-fetch.ts
  // This function is mainly for type consistency
  throw new Error("authenticatedFetch should not be called on server. Use api.get/post/etc directly.");
}

