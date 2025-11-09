"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { env } from "@/shared/config/env";
import { toast } from "@/shared/stores/toastStore";
import type { User } from "@/shared/api/types/user.types";


interface DebugLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * DebugLoginModal
 * 
 * Only visible in development mode
 * Allows manual token input for testing
 */
export function DebugLoginModal({ open, onOpenChange }: DebugLoginModalProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skipValidation, setSkipValidation] = useState(false);
  const [error, setError] = useState("");

  // Only show in development
  if (env.NEXT_PUBLIC_APP_ENV !== "development") {
    return null;
  }

  // Get API URL safely - use readPublic to avoid throwing errors
  const getApiUrl = (): string | null => {
    try {
      // Try to get the API URL using the safe readPublic method
      const apiUrl = env.readPublic("NEXT_PUBLIC_API_BASE_URL");
      return apiUrl && apiUrl.trim() ? apiUrl : null;
    } catch {
      // Fallback: try direct access to process.env (client-side)
      if (typeof window !== "undefined") {
        const directUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        return directUrl && directUrl.trim() ? directUrl : null;
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please enter a valid access token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let authResponse: { id: string; token: { access_token: string; refresh_token: string } };
      let userData: User;

      if (skipValidation) {
        // Skip validation - create mock response (like React app)
        console.log("Skipping token validation in debug mode");
        authResponse = {
          id: "debug-user",
          token: {
            access_token: token.trim(),
            refresh_token: token.trim(),
          },
        };

        // Default debug user data
        userData = {
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
          university_name: "Debug University",
          group_name: "Debug Group",
          policy_accepted: true,
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      } else {
        // Validate token by calling API
        const apiUrl = getApiUrl();
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
        }

        // Validate token
        const response = await fetch(`${apiUrl}/api/v1/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        userData = await response.json();
        authResponse = {
          id: userData.id || "debug-user",
          token: {
            access_token: token.trim(),
            refresh_token: token.trim(), // Placeholder for debug mode
          },
        };
      }

      // Send to debug endpoint to set cookies
      const debugResponse = await fetch("/api/auth/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: authResponse.token.access_token,
          user: userData,
        }),
      });

      if (!debugResponse.ok) {
        throw new Error("Failed to set token");
      }

      toast.success("Login successful", "Redirecting...");

      // Get locale from current path or use default
      const currentPath = window.location.pathname;
      const localeMatch = currentPath.match(/\/(en|ru|uz)\//);
      const locale = localeMatch ? localeMatch[1] : "en";

      // Reload page to apply new auth state
      setTimeout(() => {
        window.location.href = `/${locale}/`;
      }, 500);
    } catch (error: unknown) {
      console.error("Debug login error:", error);
      const errorMessage = error instanceof Error ? error.message : "The provided token is invalid or expired";
      setError(errorMessage);
      toast.error("Login failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Debug Login</h2>
        {!getApiUrl() && !skipValidation && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Configuration Required:</strong> Please set{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                NEXT_PUBLIC_API_BASE_URL
              </code>{" "}
              in your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code> file.
              <br />
              <span className="text-xs mt-1 block">
                Yoki &quot;Skip validation&quot; ni belgilang va mock user bilan login qiling.
              </span>
            </p>
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          Enter your access token to test authentication in development mode.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium mb-2">
              Access Token
            </label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter access token..."
              disabled={isLoading}
              className="w-full"
            />

            {/* Skip validation option (like React app) */}
            <div className="mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={skipValidation}
                  onChange={(e) => setSkipValidation(e.target.checked)}
                  className="mr-2 h-4 w-4"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  Skip validation (use mock user)
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                {!skipValidation && (
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    Try enabling &quot;Skip validation&quot; if the token is valid but API is unreachable
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || 
                !token.trim() || 
                (!skipValidation && !getApiUrl()) // API URL faqat validation kerak bo'lsa tekshiriladi
              }
              className="bg-[#FE4838] hover:bg-[#e84133]"
            >
              {isLoading ? "Validating..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

