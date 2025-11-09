import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { baseFetch } from "@/shared/api/client/base-api";
import { handleLoginSuccess } from "@/shared/api/interceptors/auth-interceptor.server";
import type { AuthResponse } from "@/shared/api/types/auth.types";
import type { User } from "@/shared/api/types/user.types";

/**
 * POST /api/auth/debug
 * 
 * Debug endpoint for development mode only
 * Validates token and sets cookies
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (env.NEXT_PUBLIC_APP_ENV !== "development") {
    return NextResponse.json(
      { error: "Debug endpoint only available in development" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { access_token } = body;

    if (!access_token || typeof access_token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid access_token" },
        { status: 400 }
      );
    }

    // Validate token by calling /api/v1/users/me
    const user = await baseFetch<User>(
      "/api/v1/users/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        requireAuth: false,
      },
      true // isServer
    );

    // Handle case where user data is already provided (skip validation mode)
    let userData = user;
    if (body.user) {
      userData = body.user;
    }

    // Token is valid, but we need refresh token
    // For debug mode, we'll create a mock response
    // In real scenario, you'd need to get refresh token from somewhere
    // For now, we'll just set the access token and use a placeholder refresh token
    // Note: This is a limitation of debug mode - refresh won't work properly
    // The refresh token is set to the same as access token for simplicity in debug mode
    
    const mockAuthResponse: AuthResponse = {
      id: userData.id || "",
      token: {
        access_token: access_token,
        refresh_token: access_token, // Placeholder - refresh won't work properly in debug mode
      },
    };

    // Set tokens and user data in cookies
    await handleLoginSuccess(mockAuthResponse, userData);

    return NextResponse.json({ success: true, user: userData });
  } catch (error: unknown) {
    console.error("Debug login error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "The provided token is invalid or expired";
    return NextResponse.json(
      { 
        error: "Invalid token",
        message: errorMessage
      },
      { status: 401 }
    );
  }
}

