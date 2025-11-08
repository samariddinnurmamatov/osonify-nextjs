/**
 * Health Service
 * Handles health check API calls
 */

import { api } from "../client";

export class HealthService {
  /**
   * Check API health status
   */
  static async checkHealth(): Promise<string> {
    return api.get<string>("/health", { requireAuth: false });
  }
}
