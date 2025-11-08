/**
 * Auth Service
 * Handles authentication-related API calls
 * 
 * Note: This service uses browserApi for client-side usage
 * For server-side usage, use serverApi directly
 */

import { browserApi } from "../client/browser-fetch";
import { handleLoginSuccess, handleLogout } from "../interceptors/auth-interceptor.client";
import type {
  AuthResponse,
  TelegramLoginData,
  LogoutRequest,
  LogoutResponse,
} from "../types/auth.types";

export class AuthService {
  /**
   * Authenticate using Telegram WebApp initData
   */
  static async loginWithWebApp(initData: string): Promise<AuthResponse> {
    const response = await browserApi.get<AuthResponse>(
      `/api/v1/auth/webapp?init_data=${encodeURIComponent(initData)}`,
      { requireAuth: false }
    );
    handleLoginSuccess(response);
    return response;
  }

  /**
   * Authenticate using Telegram login data
   */
  static async loginWithTelegram(
    data: TelegramLoginData
  ): Promise<AuthResponse> {
    const response = await browserApi.post<AuthResponse, TelegramLoginData>(
      "/api/v1/auth/telegram",
      data,
      { requireAuth: false }
    );
    handleLoginSuccess(response);
    return response;
  }

  /**
   * Logout user
   */
  static async logout(data: LogoutRequest): Promise<LogoutResponse> {
    const response = await browserApi.post<LogoutResponse, LogoutRequest>(
      "/api/v1/auth/logout",
      data,
      { requireAuth: false } // Tokens are in body
    );
    handleLogout();
    return response;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await browserApi.post<AuthResponse, undefined>(
      "/api/v1/auth/refresh",
      undefined,
      {
        requireAuth: false,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    handleLoginSuccess(response);
    return response;
  }
}
