/**
 * Environment Configuration
 * Centralized, type-safe environment variable management
 * With proper validation and error handling
 */

type AppEnv = "development" | "test" | "production";

/**
 * Assert that an environment variable exists
 * Throws a clear error if missing
 */
function assertEnv(name: string, value: string | undefined): asserts value is string {
  if (!value || value.trim() === "") {
    throw new Error(
      `❌ Missing required environment variable: ${name}\n` +
      `   Please add ${name} to your .env.local file\n` +
      `   Example: ${name}=your_value_here`
    );
  }
}

/**
 * Read public environment variable (available on client)
 * Returns empty string if not found (no fallback)
 */
function readPublic(name: string): string {
  const value = process.env[name];
  return value ?? "";
}

/**
 * Read public environment variable with assertion
 * Throws error if missing
 */
function readPublicRequired(name: string): string {
  const value = readPublic(name);
  assertEnv(name, value);
  return value;
}

/**
 * Read server-only environment variable
 * Prevents leaking to client bundles
 */
function readServer(name: string, fallback?: string): string {
  if (typeof window !== "undefined") {
    return ""; // Prevent leaking to client bundles
  }
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required server env: ${name}`);
  }
  return value;
}

/**
 * Detect if we're in production environment
 * Checks for production domain or explicit env variable
 */
function detectAppEnv(): AppEnv {
  const explicitEnv = readPublic("NEXT_PUBLIC_APP_ENV");
  if (explicitEnv === "production" || explicitEnv === "test" || explicitEnv === "development") {
    return explicitEnv as AppEnv;
  }
  
  // Server-side: check NODE_ENV first (most reliable)
  if (typeof window === "undefined") {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === "production") {
      return "production";
    }
  }
  
  // Client-side: auto-detect production by domain
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Production domains (not localhost, not .local, not .dev)
    if (hostname.includes("vercel.app") || 
        hostname.includes("osonify") || 
        (!hostname.includes("localhost") && !hostname.includes(".local") && !hostname.includes(".dev"))) {
      return "production";
    }
  }
  
  return "development";
}

/**
 * Environment configuration
 * All public variables are available on client
 * Server-only variables are guarded
 */
export const env = {
  // Public (client-accessible)
  // Use getter to detect environment dynamically
  get NEXT_PUBLIC_APP_ENV(): AppEnv {
    return detectAppEnv();
  },
  
  /**
   * Telegram Bot Username
   * Default: osonifybot
   */
  get NEXT_PUBLIC_TELEGRAM_BOT_USERNAME(): string {
    return readPublic("NEXT_PUBLIC_TELEGRAM_BOT_USERNAME") || "osonifybot";
  },
  
  /**
   * API Base URL
   * In development, defaults to https://api.osonify.ai
   * In production, must be set in .env.local
   * Example: NEXT_PUBLIC_API_BASE_URL=https://api.osonify.ai
   */
  get NEXT_PUBLIC_API_BASE_URL(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV || "development";
    
    // In development, use default if not set
    if (appEnv === "development" && (!apiUrl || apiUrl.trim() === "")) {
      return "https://api.osonify.ai";
    }
    
    // In production, require it
    if (appEnv === "production" && (!apiUrl || apiUrl.trim() === "")) {
      throw new Error(
        `❌ Missing required environment variable: NEXT_PUBLIC_API_BASE_URL\n` +
        `   Please add NEXT_PUBLIC_API_BASE_URL to your .env.local file\n` +
        `   Example: NEXT_PUBLIC_API_BASE_URL=https://api.osonify.ai`
      );
    }
    
    return apiUrl || "https://api.osonify.ai";
  },

  // Server-only utilities
  readServer,
  readPublic,
  readPublicRequired,
} as const;

export type Env = typeof env;




