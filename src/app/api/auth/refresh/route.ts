import { NextResponse } from "next/server";
import { AuthService } from "@/shared/api/services/auth.service";
import { setAuthCookies, getAuthCookies } from "@/shared/lib/cookies-server";

export async function POST() {
  try {
    const cookies = await getAuthCookies();

    if (!cookies.refreshToken) {
      return NextResponse.json(
        { detail: "Refresh token not found" },
        { status: 401 }
      );
    }

    const authResponse = await AuthService.refreshToken(cookies.refreshToken);

    // Update cookies
    await setAuthCookies(
      authResponse.token.access_token,
      authResponse.token.refresh_token,
      authResponse.id
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Token refresh failed" },
      { status: 500 }
    );
  }
}
