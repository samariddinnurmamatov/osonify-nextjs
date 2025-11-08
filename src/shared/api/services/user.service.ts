/**
 * User Service
 * Handles user-related API calls
 * 
 * Note: This service uses browserApi for client-side usage
 * For server-side usage, use serverApi directly
 */

import { browserApi } from "../client/browser-fetch";
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
    return browserApi.get<User>(`${USERS_BASE}/me`);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return browserApi.put<UpdateUserResponse, UpdateUserRequest>(USERS_BASE, data);
  }

  /**
   * Buy subscription
   */
  async buySubscription(data: BuySubscriptionRequest): Promise<void> {
    return browserApi.post<void, BuySubscriptionRequest>(`${USERS_BASE}/subscriptions/buy`, data);
  }

  /**
   * Buy per-unit subscription
   */
  async buyPerUnitSubscription(data: BuyPerUnitSubscriptionRequest): Promise<void> {
    return browserApi.post<void, BuyPerUnitSubscriptionRequest>(`${USERS_BASE}/subscriptions/buy-per-unit`, data);
  }

  /**
   * Get active subscription
   */
  async getActiveSubscription(): Promise<ActiveSubscription> {
    return browserApi.get<ActiveSubscription>(`${USERS_BASE}/subscriptions/active`);
  }
}

export const userService = new UserService();
