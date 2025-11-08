/**
 * Base Service
 * Generic CRUD service pattern for all API services
 * DRY pattern - eliminates repetitive CRUD code
 */

import { api, RequestOptions } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import { buildQuery } from "../utils/query";

export interface ListParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next?: boolean;
}

/**
 * Abstract Base Service
 * Extend this class to create domain-specific services
 */
export abstract class BaseService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /**
   * Endpoint base path (e.g., "/api/v1/presets")
   */
  protected abstract endpoint: string;

  /**
   * Get list of items with pagination
   */
  public async list<TResponse = ListResponse<T>>(
    params?: ListParams,
    options?: Omit<RequestOptions, "method" | "body" | "isFormData">
  ): Promise<TResponse> {
    return withErrorHandling(() => {
      const query = buildQuery(params || {});
      return api.get<TResponse>(`${this.endpoint}${query}`, options);
    });
  }

  /**
   * Get single item by ID
   */
  public async get<TResponse = T>(
    id: string,
    options?: Omit<RequestOptions, "method" | "body" | "isFormData">
  ): Promise<TResponse> {
    return withErrorHandling(() => {
      return api.get<TResponse>(`${this.endpoint}/${id}`, options);
    });
  }

  /**
   * Create new item
   */
  public async create<TResponse = T>(
    data: TCreate,
    options?: Omit<RequestOptions<TCreate>, "method" | "body">
  ): Promise<TResponse> {
    return withErrorHandling(() => {
      return api.post<TResponse, TCreate>(this.endpoint, data, options);
    });
  }

  /**
   * Update item by ID
   */
  public async update<TResponse = T>(
    id: string,
    data: TUpdate,
    options?: Omit<RequestOptions<TUpdate>, "method" | "body">
  ): Promise<TResponse> {
    return withErrorHandling(() => {
      return api.put<TResponse, TUpdate>(`${this.endpoint}/${id}`, data, options);
    });
  }

  /**
   * Delete item by ID
   */
  public async delete(
    id: string,
    options?: Omit<RequestOptions, "method" | "body" | "isFormData">
  ): Promise<void> {
    return withErrorHandling(() => {
      return api.delete<void>(`${this.endpoint}/${id}`, options);
    });
  }
}

