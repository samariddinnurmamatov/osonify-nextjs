/**
 * Error Handler Interceptor
 * Unified error handling for all API calls
 * DRY pattern - eliminates duplicate error handling code
 */

import { ApiError } from "../client";
import { toast } from "@/shared/stores/toastStore";
import { logger } from "../utils/logger";

/**
 * Handle API errors with unified error handling
 * Shows toast notifications and logs errors
 * @param silent - If true, suppresses toast notifications (useful for background requests)
 */
export function handleApiError(error: unknown, customMessage?: string, silent = false): ApiError {
  let apiError: ApiError;

  if (error && typeof error === "object" && "status" in error) {
    apiError = error as ApiError;
  } else if (error instanceof Error) {
    apiError = {
      status: 0,
      message: error.message,
      data: error,
    };
  } else {
    apiError = {
      status: 0,
      message: customMessage || "An unexpected error occurred",
      data: error,
    };
  }

  // Log error with context (production-aware)
  logger.error(apiError.message, {
    status: apiError.status,
    path: apiError.path,
    method: apiError.method,
    data: apiError.data,
  });

  // Show toast notification (only in browser and if not silent)
  if (!silent && typeof window !== "undefined") {
    const message = customMessage || apiError.message || "An error occurred";
    
    if (apiError.status >= 400 && apiError.status < 500) {
      // Client errors (4xx)
      toast.error("Xatolik!", message);
    } else if (apiError.status >= 500) {
      // Server errors (5xx)
      toast.error("Server xatosi!", "Serverda muammo yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    } else if (apiError.status === 0) {
      // Network errors
      toast.error("Tarmoq xatosi!", "Internetga ulanib ko'ring.");
    } else {
      toast.error("Xatolik!", message);
    }
  }

  return apiError;
}

/**
 * Wrapper for API calls with automatic error handling
 * DRY pattern - eliminates duplicate try-catch blocks
 * @param silent - If true, suppresses toast notifications (useful for background requests like health-check)
 */
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  customErrorMessage?: string,
  silent = false
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, customErrorMessage, silent);
    throw error; // Re-throw so calling code can handle if needed
  }
}

