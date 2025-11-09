import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/shared/api/services/auth.service";
import { handleLoginSuccess } from "@/shared/api/interceptors/auth-interceptor.server";
import type { TelegramLoginData } from "@/shared/api/types/auth.types";

/**
 * POST /api/auth/callback
 * 
 * Handles Telegram Login Widget callback
 * Receives Telegram auth data and exchanges it for tokens
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle new format: client already authenticated and sends tokens + user
    if (body.type && body.tokens && body.user) {
      // Client-side already authenticated, just set cookies
      const authResponse = {
        id: body.user.id || "user",
        token: body.tokens,
      };
      
      // Store tokens and user data in cookies
      await handleLoginSuccess(authResponse, body.user);

      // Extract locale from referer or use default
      const referer = request.headers.get("referer") || "";
      const localeMatch = referer.match(/\/(en|ru|uz)\//);
      const locale = localeMatch ? localeMatch[1] : "en";
      
      return NextResponse.json({ success: true, redirect: `/${locale}/` });
    }

    // Handle old format: direct Telegram data (for GET redirects)
    const telegramData: TelegramLoginData = {
      id: body.id || parseInt(body.id as string),
      first_name: body.first_name,
      last_name: body.last_name,
      username: body.username,
      photo_url: body.photo_url,
      auth_date: body.auth_date || String(body.auth_date),
      hash: body.hash,
    };

    // Validate required fields
    if (!telegramData.id || !telegramData.first_name || !telegramData.hash) {
      return NextResponse.json(
        { error: "Missing required Telegram data" },
        { status: 400 }
      );
    }

    // Call FastAPI backend to authenticate
    const authResponse = await AuthService.loginWithTelegram(telegramData);

    // Fetch user profile to store in cookies
    let userData = null;
    try {
      const { userService } = await import("@/shared/api/services/user.service");
      userData = await userService.getProfile();
    } catch (error) {
      console.error("[SSR] Failed to fetch user profile after login:", error);
      // Continue without user data - it will be fetched on next request
    }

    // Set tokens and user data in HttpOnly cookies
    await handleLoginSuccess(authResponse, userData || undefined);

    // Extract locale from referer or use default
    const referer = request.headers.get("referer") || "";
    const localeMatch = referer.match(/\/(en|ru|uz)\//);
    const locale = localeMatch ? localeMatch[1] : "en";
    
    // Redirect to /{locale}/
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  } catch (error: unknown) {
    console.error("Telegram callback error:", error);
    
    // Return 401 with error message
    const errorMessage = error instanceof Error ? error.message : "Failed to authenticate with Telegram";
    return NextResponse.json(
      { 
        error: "Authentication failed",
        message: errorMessage
      },
      { status: 401 }
    );
  }
}

/**
 * GET /api/auth/callback
 * 
 * Telegram widget sends data via GET query params
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract Telegram data from query params
    const telegramData: TelegramLoginData = {
      id: parseInt(searchParams.get("id") || "0"),
      first_name: searchParams.get("first_name") || "",
      last_name: searchParams.get("last_name") || undefined,
      username: searchParams.get("username") || undefined,
      photo_url: searchParams.get("photo_url") || undefined,
      auth_date: searchParams.get("auth_date") || "",
      hash: searchParams.get("hash") || "",
    };

    // Validate required fields
    if (!telegramData.id || !telegramData.first_name || !telegramData.hash) {
      return NextResponse.json(
        { error: "Missing required Telegram data" },
        { status: 400 }
      );
    }

    // Call FastAPI backend to authenticate
    const authResponse = await AuthService.loginWithTelegram(telegramData);

    // Fetch user profile to store in cookies
    let userData = null;
    try {
      const { userService } = await import("@/shared/api/services/user.service");
      userData = await userService.getProfile();
    } catch (error) {
      console.error("[SSR] Failed to fetch user profile after login:", error);
      // Continue without user data - it will be fetched on next request
    }

    // Set tokens and user data in HttpOnly cookies
    await handleLoginSuccess(authResponse, userData || undefined);

    // Extract locale from referer or use default
    const referer = request.headers.get("referer") || "";
    const localeMatch = referer.match(/\/(en|ru|uz)\//);
    const locale = localeMatch ? localeMatch[1] : "en";
    
    // Redirect to /{locale}/
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  } catch (error: unknown) {
    console.error("Telegram callback error:", error);
    
    // Return 401 with error message
    const errorMessage = error instanceof Error ? error.message : "Failed to authenticate with Telegram";
    return NextResponse.json(
      { 
        error: "Authentication failed",
        message: errorMessage
      },
      { status: 401 }
    );
  }
}

