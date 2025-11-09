/**
 * Interceptors
 * Tree-shakeable exports - automatically selects server or client implementation
 */

// Error handler is universal
export * from "./error-handler";

// Auth interceptor - environment-specific
// Tree-shakeable: only client code in client bundle, only server code in server bundle
let authInterceptor: typeof import("./auth-interceptor.client");

if (typeof window === "undefined") {
  // Server-side: dynamic import to avoid bundling client code
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  authInterceptor = require("./auth-interceptor.server");
} else {
  // Client-side: dynamic import to avoid bundling server code
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  authInterceptor = require("./auth-interceptor.client");
}

// Re-export for convenience
export const handleLoginSuccess = authInterceptor.handleLoginSuccess;
export const handleLogout = authInterceptor.handleLogout;
export const authenticatedFetch = authInterceptor.authenticatedFetch;

