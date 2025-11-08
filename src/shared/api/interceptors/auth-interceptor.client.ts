/**
 * Auth Interceptor - Client Side
 * Handles token refresh and retry logic in browser environment
 * Tree-shakeable - only included in client bundle
 */

"use client";

import { browserApi, ApiError, RequestOptions } from "../client";
import type { AuthResponse } from "../types/auth.types";
import { setAuthTokens, clearAuthTokens } from "../client/browser-fetch";

let isRefreshing = false;
let failedQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  failedQueue.forEach((callback) => {
    callback(token);
  });
  failedQueue = [];
};

/**
 * Get refresh token from client-side storage
 */
function getRefreshToken(): string | undefined {
  try {
    const stored = localStorage.getItem("auth-tokens");
    if (stored) {
      const tokens = JSON.parse(stored);
      return tokens.refresh_token;
    }
    
    // Fallback to cookie
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refresh_token="))
      ?.split("=")[1];
    
    return cookieValue;
  } catch {
    return undefined;
  }
}

/**
 * Refresh access token (client-side only)
 * Race condition fixed: token is passed to queued callbacks
 */
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      failedQueue.push((token) => {
        resolve(token);
      });
    }) as Promise<string | null>;
  }

  isRefreshing = true;
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    isRefreshing = false;
    const error: ApiError = {
      status: 401,
      message: "No refresh token available",
      data: null,
    };
    processQueue(null);
    throw error;
  }

  try {
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

    const newAccessToken = response.token.access_token;
    const newRefreshToken = response.token.refresh_token;

    setAuthTokens(newAccessToken, newRefreshToken);

    isRefreshing = false;
    processQueue(newAccessToken); // Pass token to queued callbacks
    return newAccessToken;
  } catch (error) {
    isRefreshing = false;
    const apiError = error as ApiError;
    processQueue(null); // Pass null on error
    
    // Clear tokens and redirect to login on refresh failure
    clearAuthTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    
    throw apiError;
  }
}

/**
 * Handle login success - store tokens (client-side only)
 */
export function handleLoginSuccess(authResponse: AuthResponse): void {
  if (typeof window !== "undefined") {
    setAuthTokens(
      authResponse.token.access_token,
      authResponse.token.refresh_token
    );
  }
}

/**
 * Handle logout - clear tokens (client-side only)
 */
export function handleLogout(): void {
  if (typeof window !== "undefined") {
    clearAuthTokens();
  }
}

/**
 * Authenticated fetch wrapper (client-side only)
 * Automatically retries with refreshed token on 401 errors
 * Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 */
export async function authenticatedFetch<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const method = (options.method || "GET").toLowerCase() as "get" | "post" | "put" | "patch" | "delete";
  const body = options.body as TBody;

  try {
    // Call appropriate method based on HTTP verb
    switch (method) {
      case "get":
        return await browserApi.get<TResponse>(path, options);
      case "post":
        return await browserApi.post<TResponse, TBody>(path, body, options);
      case "put":
        return await browserApi.put<TResponse, TBody>(path, body, options);
      case "patch":
        return await browserApi.patch<TResponse, TBody>(path, body, options);
      case "delete":
        return await browserApi.delete<TResponse>(path, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error) {
    const apiError = error as ApiError;
    
    // Only retry on 401 if we have refresh token
    if (apiError.status === 401 && getRefreshToken()) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Merge headers instead of overwriting
        const retryOptions = {
          ...options,
          headers: {
            ...(options.headers as Record<string, string>),
            Authorization: `Bearer ${newToken}`,
          },
        };
        
        // Retry with merged headers
        switch (method) {
          case "get":
            return await browserApi.get<TResponse>(path, retryOptions);
          case "post":
            return await browserApi.post<TResponse, TBody>(path, body, retryOptions);
          case "put":
            return await browserApi.put<TResponse, TBody>(path, body, retryOptions);
          case "patch":
            return await browserApi.patch<TResponse, TBody>(path, body, retryOptions);
          case "delete":
            return await browserApi.delete<TResponse>(path, retryOptions);
        }
      }
    }
    
    throw error;
  }
}
