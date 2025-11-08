"use client";

/**
 * Session Manager
 * Handles authentication initialization and token heartbeat
 */

import { useEffect, useRef } from "react";
import { useAuthStore } from "../model";
import { AuthService } from "../api/auth-service";

/**
 * Token heartbeat - checks and refreshes token before expiration
 */
function useTokenHeartbeat(intervalMs: number = 5 * 60 * 1000) {
  const { tokens, updateTokens } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!tokens?.access_token) return;

    const checkAndRefresh = async () => {
      try {
        const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();

        // Refresh if token expires in less than 1 minute
        if (exp - now < 60_000) {
          console.log("⏰ Token expiring soon — refreshing...");
          const refreshResponse = await AuthService.refreshToken(tokens.refresh_token);
          updateTokens(refreshResponse.token);
        }
      } catch (err) {
        console.warn("⚠️ Token heartbeat error:", err);
      }
    };

    // Initial check
    checkAndRefresh();

    // Periodic check
    intervalRef.current = setInterval(checkAndRefresh, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tokens, intervalMs, updateTokens]);
}

/**
 * Session Manager Hook
 * Initializes auth and manages token heartbeat
 */
export function useSessionManager() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Token heartbeat
  useTokenHeartbeat(5 * 60 * 1000); // Check every 5 minutes
}

