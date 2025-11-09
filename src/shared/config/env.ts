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
 * Environment configuration
 * All public variables are available on client
 * Server-only variables are guarded
 */
export const env = {
  // Public (client-accessible)
  NEXT_PUBLIC_APP_ENV: (readPublic("NEXT_PUBLIC_APP_ENV") || "development") as AppEnv,
  
  /**
   * API Base URL - REQUIRED
   * Must be set in .env.local
   * Example: NEXT_PUBLIC_API_BASE_URL=https://api.osonify.ai
   */
  get NEXT_PUBLIC_API_BASE_URL(): string {
    return readPublicRequired("NEXT_PUBLIC_API_BASE_URL");
  },

  // Server-only utilities
  readServer,
  readPublic,
  readPublicRequired,
} as const;

export type Env = typeof env;




