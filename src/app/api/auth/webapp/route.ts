import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/shared/api/services/auth.service";
import { setAuthCookies } from "@/shared/lib/cookies-server";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const initData = searchParams.get("init_data");

    if (!initData) {
      return NextResponse.json(
        { detail: "init_data is required" },
        { status: 422 }
      );
    }

    const authResponse = await AuthService.loginWithWebApp(initData);

    // Set cookies
    await setAuthCookies(
      authResponse.token.access_token,
      authResponse.token.refresh_token,
      authResponse.id
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("WebApp login error:", error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Login failed" },
      { status: 500 }
    );
  }
}

