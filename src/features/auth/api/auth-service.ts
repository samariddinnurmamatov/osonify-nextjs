"use client";

/**
 * Client-side Auth Service
 * Handles authentication operations in browser
 */

import { browserApi, setAuthTokens, clearAuthTokens } from "@/shared/api/client";
import { userService } from "@/shared/api/services";
import { useAuthStore } from "../model";
import type { AuthResponse, TelegramLoginData, User } from "../model/types";

export class AuthService {
  /**
   * Authenticate using Telegram WebApp initData
   */
  static async loginWithWebApp(initData: string): Promise<AuthResponse> {
    const response = await browserApi.get<AuthResponse>(
      `/api/v1/auth/webapp?init_data=${encodeURIComponent(initData)}`,
      { requireAuth: false }
    );
    
    // Store tokens
    setAuthTokens(response.token.access_token, response.token.refresh_token);
    
    return response;
  }

  /**
   * Authenticate using Telegram login data
   */
  static async loginWithTelegram(data: TelegramLoginData): Promise<AuthResponse> {
    const response = await browserApi.post<AuthResponse, TelegramLoginData>(
      "/api/v1/auth/telegram",
      data,
      { requireAuth: false }
    );
    
    // Store tokens
    setAuthTokens(response.token.access_token, response.token.refresh_token);
    
    return response;
  }

  /**
   * Login with token (debug mode)
   */
  static async loginWithToken(token: string, skipValidation = false): Promise<{ response: AuthResponse; user: User }> {
    const authResponse: AuthResponse = {
      id: "debug-user",
      token: {
        access_token: token.trim(),
        refresh_token: token.trim(),
      },
    };

    // Store tokens
    setAuthTokens(token.trim(), token.trim());

    let user: User;

    if (skipValidation) {
      // Create mock user
      user = {
        id: "debug-user",
        first_name: "Debug",
        last_name: "User",
        username: "debug_user",
        telegram_id: 123456789,
        language: "en",
        interface_lang: "en",
        balance: 100,
        points: 50,
        is_used_free_trial: false,
        refer_count: 0,
        policy_accepted: true,
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        plan: {
          user_id: "debug-user",
          plan: "free",
          plan_type: "trial",
          expenses: [],
          created_at: new Date().toISOString(),
          expire_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          id: "debug-plan",
        },
      };
    } else {
      // Validate token by fetching profile
      try {
        user = await userService.getProfile();
      } catch (error) {
        console.warn("Could not fetch profile, using default debug user:", error);
        // Fallback to default debug user
        user = {
          id: "debug-user",
          first_name: "Debug",
          last_name: "User",
          username: "debug_user",
          telegram_id: 123456789,
          language: "en",
          interface_lang: "en",
          balance: 100,
          points: 50,
          is_used_free_trial: false,
          refer_count: 0,
          policy_accepted: true,
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    return { response: authResponse, user };
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const { tokens } = useAuthStore.getState();
      if (tokens?.access_token && tokens?.refresh_token) {
        await browserApi.post(
          "/api/v1/auth/logout",
          {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          },
          { requireAuth: false }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthTokens();
      useAuthStore.getState().clearAuth();
    }
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
    
    // Update tokens
    setAuthTokens(response.token.access_token, response.token.refresh_token);
    
    return response;
  }
}

