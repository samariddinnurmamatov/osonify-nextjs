/**
 * Common Types
 * Shared types used across multiple services
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next?: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface SuccessResponse {
  success: boolean;
}

