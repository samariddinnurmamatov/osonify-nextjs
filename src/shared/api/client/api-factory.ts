/**
 * API Client Factory
 * DRY pattern - creates server/browser API clients with shared logic
 * Eliminates code duplication between serverApi and browserApi
 * Note: Cookie forwarding is handled in server-fetch.ts, not here (for performance)
 */

import { baseFetch, RequestOptions, ApiError } from "./base-api";

type TokenGetter = () => Promise<string | undefined> | string | undefined;

/**
 * Create API client with token getter
 * This factory eliminates duplication between server and browser implementations
 */
function createApiClient(getToken: TokenGetter, isServer: boolean) {
  /**
   * Fetch wrapper with automatic token injection
   * Cookie forwarding is handled in server-fetch.ts for better performance
   */
  async function fetchWithAuth<TResponse, TBody = unknown>(
    path: string,
    options: RequestOptions<TBody> = {}
  ): Promise<TResponse> {
    const { headers = {}, requireAuth = true, ...restOptions } = options;

    const requestHeaders: Record<string, string> = {
      ...(headers as Record<string, string>),
    };

    // Add Authorization header if auth is required
    // Auto-detect if token exists, otherwise requireAuth can be false
    if (requireAuth) {
      const token = await getToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    // Note: Cookie forwarding is handled in server-fetch.ts
    // This avoids dynamic import on every request, improving SSR performance

    return baseFetch<TResponse, TBody>(path, {
      ...restOptions,
      headers: requestHeaders,
      requireAuth: false, // Already handled above
    }, isServer);
  }

  /**
   * API methods factory
   * Creates get, post, put, patch, delete methods
   */
  return {
    get: <TResponse>(
      path: string,
      options?: Omit<RequestOptions, "method" | "body" | "isFormData">
    ) => fetchWithAuth<TResponse>(path, { ...options, method: "GET" }),

    post: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody>, "method" | "body">
    ) =>
      fetchWithAuth<TResponse, TBody>(path, {
        ...options,
        method: "POST",
        body,
        isFormData: typeof FormData !== "undefined" && body instanceof FormData,
      }),

    put: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody>, "method" | "body">
    ) =>
      fetchWithAuth<TResponse, TBody>(path, {
        ...options,
        method: "PUT",
        body,
        isFormData: typeof FormData !== "undefined" && body instanceof FormData,
      }),

    patch: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody>, "method" | "body">
    ) =>
      fetchWithAuth<TResponse, TBody>(path, {
        ...options,
        method: "PATCH",
        body,
        isFormData: typeof FormData !== "undefined" && body instanceof FormData,
      }),

    delete: <TResponse>(
      path: string,
      options?: Omit<RequestOptions, "method" | "body" | "isFormData">
    ) => fetchWithAuth<TResponse>(path, { ...options, method: "DELETE" }),
  };
}

export { createApiClient };
export type { RequestOptions, ApiError };

