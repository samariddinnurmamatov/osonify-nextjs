import { env } from "@/shared/config/env";
import type {
  AuthResponse,
  TelegramLoginData,
  LogoutRequest,
  LogoutResponse,
} from "../types";

const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

export class AuthService {
  /**
   * Authenticate using Telegram WebApp init_data
   */
  static async loginWithWebApp(initData: string): Promise<AuthResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/webapp?init_data=${encodeURIComponent(initData)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  }

  /**
   * Authenticate using Telegram user data
   */
  static async loginWithTelegram(data: TelegramLoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  }

  /**
   * Logout user
   */
  static async logout(tokens: LogoutRequest): Promise<LogoutResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokens),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Logout failed" }));
      throw new Error(error.detail || "Logout failed");
    }

    return response.json();
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Token refresh failed" }));
      throw new Error(error.detail || "Token refresh failed");
    }

    return response.json();
  }
}
