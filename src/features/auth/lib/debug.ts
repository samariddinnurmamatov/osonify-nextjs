/**
 * Debug Mode Utilities
 * Checks if debug mode is enabled
 */

interface WindowWithEnv extends Window {
  _env_?: {
    NEXT_PUBLIC_DEBUG_MODE?: string;
  };
}

export const isDebugMode = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check runtime env (window._env_)
  const runtimeDebug = (window as WindowWithEnv)._env_?.NEXT_PUBLIC_DEBUG_MODE;
  
  // Check build-time env
  const buildTimeDebug = process.env.NEXT_PUBLIC_DEBUG_MODE;
  
  return runtimeDebug === "true" || buildTimeDebug === "true";
};

/**
 * Log debug messages only when in debug mode
 */
export const debugLog = (...args: unknown[]): void => {
  if (isDebugMode()) {
    console.log("[DEBUG]", ...args);
  }
};

/**
 * Log debug warnings only when in debug mode
 */
export const debugWarn = (...args: unknown[]): void => {
  if (isDebugMode()) {
    console.warn("[DEBUG]", ...args);
  }
};

/**
 * Log debug errors only when in debug mode
 */
export const debugError = (...args: unknown[]): void => {
  if (isDebugMode()) {
    console.error("[DEBUG]", ...args);
  }
};

