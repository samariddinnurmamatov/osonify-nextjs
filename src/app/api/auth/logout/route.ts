import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/shared/api/services/auth.service";
import { handleLogout } from "@/shared/api/interceptors/auth-interceptor.server";
import type { LogoutRequest } from "@/shared/api/types/auth.types";

/**
 * POST /api/auth/logout
 * 
 * Logs out user by calling backend and clearing cookies
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // If we have tokens, call backend logout
    if (accessToken && refreshToken) {
      try {
        const logoutData: LogoutRequest = {
          access_token: accessToken,
          refresh_token: refreshToken,
        };
        await AuthService.logout(logoutData);
      } catch (error) {
        // Even if backend logout fails, clear cookies
        console.error("Backend logout error:", error);
      }
    }

    // Clear cookies
    await handleLogout();

    // Extract locale from referer or use default
    const referer = request.headers.get("referer") || "";
    const localeMatch = referer.match(/\/(en|ru|uz)\//);
    const locale = localeMatch ? localeMatch[1] : "en";
    
    // Redirect to login
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  } catch (error: unknown) {
    console.error("Logout error:", error);
    
    // Still clear cookies even on error
    await handleLogout();
    
    // Extract locale from referer or use default
    const referer = request.headers.get("referer") || "";
    const localeMatch = referer.match(/\/(en|ru|uz)\//);
    const locale = localeMatch ? localeMatch[1] : "en";
    
    // Redirect to login
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

