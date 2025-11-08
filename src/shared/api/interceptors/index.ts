/**
 * Interceptors
 * 
 * IMPORTANT: 
 * - For client components: import from "./auth-interceptor.client"
 * - For server components: import from "./auth-interceptor.server"
 * 
 * Do not use barrel exports (index.ts) for auth interceptors to avoid bundling issues
 */

// Error handler is universal
export * from "./error-handler";

// Client-side auth interceptor (for client components)
export {
  handleLoginSuccess as handleLoginSuccessClient,
  handleLogout as handleLogoutClient,
  authenticatedFetch as authenticatedFetchClient,
} from "./auth-interceptor.client";

// Note: Server-side interceptors should be imported directly:
// import { handleLoginSuccess, handleLogout } from "@/shared/api/interceptors/auth-interceptor.server";

