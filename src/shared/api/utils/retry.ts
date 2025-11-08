/**
 * Retry Utility
 * Universal retry mechanism for token refresh
 * Prevents infinite loops with retry limits
 */

import { ApiError } from "../client";

const MAX_RETRY_COUNT = 1; // Only retry once

export interface RetryOptions {
  maxRetries?: number;
  retryCondition?: (error: ApiError) => boolean;
}

/**
 * Retry on 401 with token refresh
 * Universal helper for both server and client
 */
export async function retryOn401<TResponse>(
  fetchFn: () => Promise<TResponse>,
  refreshFn: () => Promise<string | null>,
  retryCount = 0,
  options: RetryOptions = {}
): Promise<TResponse> {
  const { maxRetries = MAX_RETRY_COUNT, retryCondition = (e) => e.status === 401 } = options;

  try {
    return await fetchFn();
  } catch (error) {
    const apiError = error as ApiError;

    // Check if we should retry
    if (retryCondition(apiError) && retryCount < maxRetries) {
      const newToken = await refreshFn();
      
      if (newToken) {
        // Retry with new token
        return retryOn401(fetchFn, refreshFn, retryCount + 1, options);
      }
    }

    throw error;
  }
}

