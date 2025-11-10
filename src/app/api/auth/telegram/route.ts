import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/shared/api/services/auth.service";
import { setAuthCookies } from "@/shared/lib/cookies-server";
import type { TelegramLoginData } from "@/shared/api/types";

export async function POST(request: NextRequest) {
  try {
    const data: TelegramLoginData = await request.json();

    if (!data.id || !data.hash || !data.auth_date) {
      return NextResponse.json(
        { detail: "Invalid Telegram data" },
        { status: 422 }
      );
    }

    const authResponse = await AuthService.loginWithTelegram(data);

    // Set cookies
    await setAuthCookies(
      authResponse.token.access_token,
      authResponse.token.refresh_token,
      authResponse.id
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Telegram login error:", error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Login failed" },
      { status: 500 }
    );
  }
}

