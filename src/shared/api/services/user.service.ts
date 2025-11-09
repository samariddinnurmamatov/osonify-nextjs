/**
 * User Service
 * Handles user-related API calls
 */

import { api } from "../client";
import type {
  User,
  UpdateUserRequest,
  UpdateUserResponse,
  BuySubscriptionRequest,
  BuyPerUnitSubscriptionRequest,
  ActiveSubscription,
} from "../types";

const USERS_BASE = "/api/v1/users";

export class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return api.get<User>(`${USERS_BASE}/me`);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return api.put<UpdateUserResponse, UpdateUserRequest>(USERS_BASE, data);
  }

  /**
   * Buy subscription
   */
  async buySubscription(data: BuySubscriptionRequest): Promise<void> {
    return api.post<void, BuySubscriptionRequest>(`${USERS_BASE}/subscriptions/buy`, data);
  }

  /**
   * Buy per-unit subscription
   */
  async buyPerUnitSubscription(data: BuyPerUnitSubscriptionRequest): Promise<void> {
    return api.post<void, BuyPerUnitSubscriptionRequest>(`${USERS_BASE}/subscriptions/buy-per-unit`, data);
  }

  /**
   * Get active subscription
   */
  async getActiveSubscription(): Promise<ActiveSubscription> {
    return api.get<ActiveSubscription>(`${USERS_BASE}/subscriptions/active`);
  }
}

export const userService = new UserService();
