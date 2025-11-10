import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/shared/lib/cookies-server";
import { env } from "@/shared/config/env";

export async function POST(request: NextRequest) {
  // Only allow in development
  if (env.NEXT_PUBLIC_APP_ENV === "production") {
    return NextResponse.json(
      { detail: "Debug login is not available in production" },
      { status: 403 }
    );
  }

  try {
    const { token, skipValidation } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { detail: "Token is required" },
        { status: 422 }
      );
    }

    // If skipValidation is true, just set the token without API validation
    if (skipValidation) {
      // Extract user ID from token (JWT format: header.payload.signature)
      // This is a simple extraction, you might want to decode JWT properly
      let userId = "debug-user";
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub || payload.id || payload.user_id || "debug-user";
      } catch {
        // If token is not JWT, use default
      }

      await setAuthCookies(token, token, userId);

      return NextResponse.json({
        id: userId,
        token: {
          access_token: token,
          refresh_token: token,
        },
      });
    }

    // Validate token with API
    const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { detail: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await response.json();

    await setAuthCookies(token, token, user.id || "debug-user");

    return NextResponse.json({
      id: user.id,
      token: {
        access_token: token,
        refresh_token: token,
      },
    });
  } catch (error) {
    console.error("Debug login error:", error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Debug login failed" },
      { status: 500 }
    );
  }
}
