/**
 * Server-side Fetch Utility
 * Handles API calls in Next.js server components, server actions, and route handlers
 * Uses Next.js 15 cookies() and headers() APIs
 * Includes SSR token refresh support with retry limits
 */

import { cookies, headers as nextHeaders } from "next/headers";
import { createApiClient, RequestOptions, ApiError } from "./api-factory";
import { baseFetch } from "./base-api";

const TOKEN_COOKIE_NAME = "access_token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const MAX_RETRY_COUNT = 1; // Prevent infinite loops

/**
 * Get access token from server-side cookies
 * Next.js 15: cookies() can be async in some contexts, but sync in most cases
 */
async function getAccessToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  } catch {
    // Cookies not available (e.g., in middleware or edge runtime)
    return undefined;
  }
}

/**
 * Get refresh token from server-side cookies
 */
async function getRefreshToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  } catch {
    return undefined;
  }
}

/**
 * Refresh access token on server-side
 * Stores new tokens in cookies
 */
async function serverRefreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await baseFetch<{ id: string; token: { access_token: string; refresh_token: string } }>(
      "/api/v1/auth/refresh",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        requireAuth: false,
      },
      true // isServer
    );

    const newAccessToken = response.token.access_token;
    const newRefreshToken = response.token.refresh_token;

    // Update cookies with new tokens
    try {
      const cookieStore = await cookies();
      
      // Set access token cookie (1 hour)
      cookieStore.set(TOKEN_COOKIE_NAME, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });
      
      // Set refresh token cookie (7 days)
      cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    } catch {
      // Cookie setting failed, but return token anyway
    }

    return newAccessToken;
  } catch {
    return null;
  }
}

/**
 * Server-side fetch wrapper with token refresh support and retry limits
 */
async function serverFetchWithRefresh<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
  retryCount = 0
): Promise<TResponse> {
  const { headers = {}, requireAuth = true, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Add Authorization header if auth is required
  if (requireAuth) {
    let token = await getAccessToken();
    
    // If no token, try refresh
    if (!token) {
      token = await serverRefreshAccessToken() || undefined;
    }
    
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Forward cookies from incoming request
  try {
    const headersList = await nextHeaders();
    const cookieHeader = headersList.get("cookie");
    if (cookieHeader && !requestHeaders.cookie) {
      requestHeaders.cookie = cookieHeader;
    }
  } catch {
    // Headers not available (e.g., in middleware or edge runtime)
  }

  try {
    return await baseFetch<TResponse, TBody>(
      path,
      {
        ...restOptions,
        headers: requestHeaders,
        requireAuth: false,
      },
      true // isServer
    );
  } catch (error) {
    const apiError = error as ApiError;
    
    // If 401 and we have refresh token, try refresh and retry (with limit)
    if (apiError.status === 401 && requireAuth && retryCount < MAX_RETRY_COUNT) {
      const newToken = await serverRefreshAccessToken();
      if (newToken) {
        requestHeaders.Authorization = `Bearer ${newToken}`;
        // Retry with incremented count
        return serverFetchWithRefresh<TResponse, TBody>(path, {
          ...restOptions,
          headers: requestHeaders,
          requireAuth: false,
        }, retryCount + 1);
      }
    }
    
    throw error;
  }
}

/**
 * Server-side API client
 * Created using factory pattern for DRY, enhanced with refresh support
 */
export const serverApi = createApiClient(getAccessToken, true);

// Override with refresh support for automatic token refresh on 401
serverApi.get = <TResponse>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body" | "isFormData">
) => serverFetchWithRefresh<TResponse>(path, { ...options, method: "GET" });

serverApi.post = <TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions<TBody>, "method" | "body">
) =>
  serverFetchWithRefresh<TResponse, TBody>(path, {
    ...options,
    method: "POST",
    body,
    isFormData: typeof FormData !== "undefined" && body instanceof FormData,
  });

serverApi.put = <TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions<TBody>, "method" | "body">
) =>
  serverFetchWithRefresh<TResponse, TBody>(path, {
    ...options,
    method: "PUT",
    body,
    isFormData: typeof FormData !== "undefined" && body instanceof FormData,
  });

serverApi.patch = <TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<RequestOptions<TBody>, "method" | "body">
) =>
  serverFetchWithRefresh<TResponse, TBody>(path, {
    ...options,
    method: "PATCH",
    body,
    isFormData: typeof FormData !== "undefined" && body instanceof FormData,
  });

serverApi.delete = <TResponse>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body" | "isFormData">
) => serverFetchWithRefresh<TResponse>(path, { ...options, method: "DELETE" });

export type { RequestOptions, ApiError };
