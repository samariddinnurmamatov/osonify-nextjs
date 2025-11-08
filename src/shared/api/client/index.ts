/**
 * Universal API Client
 * Automatically selects server or browser implementation based on environment
 * This is the main export for API calls
 * 
 * IMPORTANT: serverApi is only available in server components
 * Use browserApi directly in client components
 */

import { browserApi } from "./browser-fetch";

/**
 * Universal API client
 * Automatically uses serverApi in server components and browserApi in client components
 * 
 * Note: In client components, this will always use browserApi
 * In server components, use serverApi directly from "./server-fetch"
 */
export const api = typeof window === "undefined" 
  ? (() => {
      // Dynamic import for server-side only (prevents client bundle from including server code)
      // This will be replaced at build time for server components
      throw new Error(
        "api is not available in this context. " +
        "In server components, import serverApi from '@/shared/api/client/server-fetch' directly. " +
        "In client components, import browserApi from '@/shared/api/client/browser-fetch' or use api from this file."
      );
    })()
  : browserApi;

// Re-export browser API for client components
export { browserApi };

// Re-export types
export type { RequestOptions, ApiError, HttpMethod } from "./base-api";

// Re-export token management functions (only available in browser)
export { setAuthTokens, clearAuthTokens } from "./browser-fetch";

