/**
 * Universal API Client
 * Automatically selects server or browser implementation based on environment
 * This is the main export for API calls
 */

import { serverApi } from "./server-fetch";
import { browserApi } from "./browser-fetch";

/**
 * Universal API client
 * Automatically uses serverApi in server components and browserApi in client components
 */
export const api = typeof window === "undefined" ? serverApi : browserApi;

// Re-export server and browser APIs for advanced usage
export { serverApi, browserApi };

// Re-export types
export type { RequestOptions, ApiError, HttpMethod } from "./base-api";

// Re-export token management functions (only available in browser)
export { setAuthTokens, clearAuthTokens } from "./browser-fetch";

