/**
 * Base API Client
 * Universal fetch helper - optimized for SSR, CSR, and Edge runtime
 * Enterprise-grade with proper error handling and performance optimizations
 */

import { env } from "@/shared/config/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type CachePolicy = RequestCache;

export interface RequestOptions<TBody = unknown> extends Omit<RequestInit, "body" | "method"> {
  method?: HttpMethod;
  body?: TBody;
  timeoutMs?: number;
  requireAuth?: boolean;
  isFormData?: boolean;
  cache?: CachePolicy | RequestCache;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  path?: string;
  method?: string;
}

const DEFAULT_TIMEOUT_MS = 15000;
const SSR_TIMEOUT_MS = 0; // No timeout for SSR (server-side doesn't need abort)

function withBase(path: string): string {
  const base = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path}`;
}

/**
 * Build request body with optimizations
 * - Empty body is not sent to fetch
 * - FormData is handled correctly
 * - JSON is stringified only when needed
 */
function buildRequestBody<TBody>(
  body: TBody | undefined | null,
  isFormData: boolean
): { body: BodyInit | undefined; contentType?: string } {
  if (body === undefined || body === null) {
    return { body: undefined };
  }

  // FormData - browser handles Content-Type automatically
  if (isFormData || body instanceof FormData) {
    return { body: body as unknown as FormData };
  }

  // String, Blob, ArrayBuffer - pass as-is
  if (typeof body === "string" || body instanceof Blob || body instanceof ArrayBuffer) {
    return { body: body as BodyInit };
  }

  // Object - stringify to JSON
  return {
    body: JSON.stringify(body),
    contentType: "application/json",
  };
}

/**
 * Parse response based on content type
 * Helper function to reduce code duplication
 */
async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type");
  
  if (contentType?.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}

/**
 * Base fetch function - universal for server, client, and edge runtime
 * Optimized with:
 * - SSR/Edge timeout handling (no timeout for SSR/Edge)
 * - Body optimization (empty body not sent)
 * - Proper error handling with context
 * - Edge runtime compatible (no Node.js dependencies)
 */
export async function baseFetch<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
  isServer = false
): Promise<TResponse> {
  const {
    method = "GET",
    headers = {},
    body,
    signal,
    timeoutMs = isServer ? SSR_TIMEOUT_MS : DEFAULT_TIMEOUT_MS,
    isFormData = false,
    cache = isServer ? "force-cache" : "no-store", // SSR default: force-cache, Client default: no-store
    ...restOptions
  } = options;

  const fullPath = withBase(path);

  // AbortController only for client-side (SSR/Edge doesn't need timeout)
  // Edge runtime compatible - uses native fetch AbortController
  let controller: AbortController | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (!isServer && timeoutMs > 0 && typeof setTimeout !== "undefined") {
    controller = new AbortController();
    timeoutId = setTimeout(() => {
      controller?.abort();
    }, timeoutMs);
  }

  // Build headers
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Build body with optimization
  const { body: requestBody, contentType } = buildRequestBody(body, isFormData || body instanceof FormData);
  
  // Set Content-Type only if not FormData
  if (contentType && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = contentType;
  }

  try {
    const response = await fetch(fullPath, {
      method,
      headers: requestHeaders,
      body: requestBody, // undefined if empty - fetch won't send it
      signal: signal || controller?.signal,
      cache: cache as RequestCache,
      ...restOptions,
    });

    if (timeoutId) clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: unknown;
      const contentType = response.headers.get("content-type");
      
      try {
        if (contentType?.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
      } catch {
        errorData = response.statusText;
      }

      const error: ApiError = {
        status: response.status,
        message: typeof errorData === "string" 
          ? errorData 
          : (errorData as any)?.message || response.statusText,
        data: errorData,
        path: fullPath,
        method,
      };

      throw error;
    }

    return await parseResponse<TResponse>(response);
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === "AbortError") {
      throw {
        status: 408,
        message: "Request timeout",
        data: null,
        path: fullPath,
        method,
      } as ApiError;
    }

    // Re-throw ApiError as-is
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    // Wrap unknown errors
    throw {
      status: 0,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      data: error,
      path: fullPath,
      method,
    } as ApiError;
  }
}

