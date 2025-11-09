import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseFetch } from "@/shared/api/client/base-api";
import { handleLoginSuccess } from "@/shared/api/interceptors/auth-interceptor.server";
import type { AuthResponse } from "@/shared/api/types/auth.types";
import type { User } from "@/shared/api/types/user.types";

const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

/**
 * POST /api/auth/refresh
 * 
 * Refreshes access token using refresh token from cookies
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

    if (!refreshToken) {
      // No refresh token, redirect to login
      const referer = request.headers.get("referer") || "";
      const localeMatch = referer.match(/\/(en|ru|uz)\//);
      const locale = localeMatch ? localeMatch[1] : "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Call FastAPI backend to refresh token
    const authResponse = await baseFetch<AuthResponse>(
      "/api/v1/auth/refresh",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        requireAuth: false,
      },
      true // isServer
    );

    // Fetch user profile to update in cookies
    let userData: User | null = null;
    try {
      const { serverApi } = await import("@/shared/api/client/server-fetch");
      userData = await serverApi.get<User>("/api/v1/users/me", {
        requireAuth: true,
        cache: "no-store",
      });
    } catch (error) {
      console.error("[SSR] Failed to fetch user profile after refresh:", error);
      // Continue without user data - it will be fetched on next request
    }

    // Update tokens and user data in cookies
    await handleLoginSuccess(authResponse, userData || undefined);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Token refresh error:", error);
    
    // Clear cookies on refresh failure
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);

    // Redirect to login
    const referer = request.headers.get("referer") || "";
    const localeMatch = referer.match(/\/(en|ru|uz)\//);
    const locale = localeMatch ? localeMatch[1] : "en";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

