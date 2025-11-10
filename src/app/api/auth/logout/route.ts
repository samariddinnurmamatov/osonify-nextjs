import { NextResponse } from "next/server";
import { AuthService } from "@/shared/api/services/auth.service";
import { clearAuthCookies, getAuthCookies } from "@/shared/lib/cookies-server";

export async function POST() {
  try {
    const cookies = await getAuthCookies();

    if (cookies.accessToken && cookies.refreshToken) {
      try {
        await AuthService.logout({
          access_token: cookies.accessToken,
          refresh_token: cookies.refreshToken,
        });
      } catch (error) {
        console.error("Logout API error:", error);
        // Continue to clear cookies even if API call fails
      }
    }

    // Clear cookies
    await clearAuthCookies();

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies on error
    await clearAuthCookies();
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Logout failed" },
      { status: 500 }
    );
  }
}
