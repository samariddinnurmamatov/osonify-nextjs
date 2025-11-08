/**
 * Debug Mode Utilities
 * Checks if debug mode is enabled
 */

export const isDebugMode = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check runtime env (window._env_)
  const runtimeDebug = (window as any)._env_?.NEXT_PUBLIC_DEBUG_MODE;
  
  // Check build-time env
  const buildTimeDebug = process.env.NEXT_PUBLIC_DEBUG_MODE;
  
  return runtimeDebug === "true" || buildTimeDebug === "true";
};

/**
 * Log debug messages only when in debug mode
 */
export const debugLog = (...args: any[]): void => {
  if (isDebugMode()) {
    console.log("[DEBUG]", ...args);
  }
};

/**
 * Log debug warnings only when in debug mode
 */
export const debugWarn = (...args: any[]): void => {
  if (isDebugMode()) {
    console.warn("[DEBUG]", ...args);
  }
};

/**
 * Log debug errors only when in debug mode
 */
export const debugError = (...args: any[]): void => {
  if (isDebugMode()) {
    console.error("[DEBUG]", ...args);
  }
};

