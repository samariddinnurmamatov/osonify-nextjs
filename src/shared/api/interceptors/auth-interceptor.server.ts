/**
 * Auth Interceptor - Server Side
 * Server-side token management utilities
 * Tree-shakeable - only included in server bundle
 */

import { cookies } from "next/headers";
import type { AuthResponse } from "../types/auth.types";
import type { User } from "../types/user.types";
import type { RequestOptions } from "../client";

const TOKEN_COOKIE_NAME = "access_token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const USER_COOKIE_NAME = "user_data";

/**
 * Handle login success - store tokens and user data in cookies (server-side)
 */
export async function handleLoginSuccess(
  authResponse: AuthResponse,
  userData?: User
): Promise<void> {
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

  // Store user data in cookie if provided
  if (userData) {
    try {
      const userDataJson = JSON.stringify(userData);
      cookieStore.set(USER_COOKIE_NAME, userDataJson, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days (same as refresh token)
        path: "/",
      });
    } catch (error) {
      console.error("[SSR] Failed to store user data in cookie:", error);
    }
  }
}

/**
 * Get user data from cookies (server-side)
 */
export async function getUserFromCookies(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get(USER_COOKIE_NAME)?.value;
    
    if (!userDataCookie) {
      return null;
    }

    return JSON.parse(userDataCookie) as User;
  } catch (error) {
    console.error("[SSR] Failed to parse user data from cookie:", error);
    return null;
  }
}

/**
 * Handle logout - clear tokens and user data from cookies (server-side)
 */
export async function handleLogout(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete(TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);
}

/**
 * Authenticated fetch wrapper (server-side)
 * Note: Server-side refresh is handled in server-fetch.ts
 * This is just a placeholder for type consistency
 */
export async function authenticatedFetch<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  // Server-side refresh is handled in server-fetch.ts
  // This function is mainly for type consistency
  throw new Error("authenticatedFetch should not be called on server. Use api.get/post/etc directly.");
}

