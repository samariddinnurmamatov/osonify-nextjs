/**
 * SSR Authentication Utilities
 * Reusable functions for server-side authentication checks
 * Optimized for Next.js 15 App Router with FSD architecture
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverApi } from "@/shared/api/client/server-fetch";
import { getUserFromCookies } from "@/shared/api/interceptors/auth-interceptor.server";
import type { User } from "@/shared/api/types/user.types";
import type { AppLocale } from "@/shared/config/i18n";

const TOKEN_COOKIE_NAME = "access_token";

/**
 * Get authenticated user (SSR)
 * 
 * This function:
 * 1. Checks for user data in cookies (fast path)
 * 2. If not found, fetches from API using token
 * 3. Returns user data or null
 * 
 * @returns User object or null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!accessToken) {
      return null;
    }

    // Try to get user from cookies first (fast path)
    const cachedUser = await getUserFromCookies();
    if (cachedUser) {
      return cachedUser;
    }

    // If not in cookies, fetch from API
    try {
      const user = await serverApi.get<User>("/api/v1/users/me", {
        requireAuth: true,
        cache: "no-store",
      });
      
      return user;
    } catch (error: unknown) {
      // If 401, token is invalid
      const errorObj = error as { status?: number };
      if (errorObj?.status === 401) {
        return null;
      }
      throw error;
    }
  } catch (error) {
    console.error("[SSR] Auth check error:", error);
    return null;
  }
}

/**
 * Require authentication (SSR)
 * 
 * Redirects to login if not authenticated
 * Returns user if authenticated
 * 
 * @param locale - Current locale for redirect
 * @returns User object (never null, throws redirect if not authenticated)
 */
export async function requireAuth(locale: AppLocale = "en"): Promise<User> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect(`/${locale}/login`);
  }
  
  return user;
}

/**
 * Get authenticated user with error details (SSR)
 * 
 * Useful when you need to handle errors gracefully
 * 
 * @returns Object with user and optional error message
 */
export async function getAuthenticatedUserWithError(): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!accessToken) {
      return { user: null, error: "No access token" };
    }

    // Try to get user from cookies first (fast path)
    const cachedUser = await getUserFromCookies();
    if (cachedUser) {
      return { user: cachedUser };
    }

    // If not in cookies, fetch from API
    try {
      const user = await serverApi.get<User>("/api/v1/users/me", {
        requireAuth: true,
        cache: "no-store",
      });
      
      return { user };
    } catch (error: unknown) {
      const errorObj = error as { status?: number; path?: string; message?: string };
      if (errorObj?.status === 401) {
        return { user: null, error: "Unauthorized (401)" };
      }
      if (errorObj?.status === 404) {
        return { user: null, error: `Endpoint not found (404): ${errorObj?.path || "/api/v1/users/me"}` };
      }
      return {
        user: null,
        error: `Error ${errorObj?.status || "unknown"}: ${errorObj?.message || "Failed to fetch user profile"}`,
      };
    }
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return {
      user: null,
      error: errorObj?.message || "Unknown error occurred",
    };
  }
}

