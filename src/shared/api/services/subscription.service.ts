/**
 * Subscription Service
 * Handles subscription-related API calls
 */

import { api } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import type {
  BuySubscriptionRequest,
  BuyPerUnitSubscriptionRequest,
  SubscriptionPlan,
  ActiveSubscription,
} from "../types/subscription.types";

const SUBSCRIPTIONS_BASE = "/api/v1/subscriptions";

export class SubscriptionService {
  /**
   * Buy subscription
   */
  async buySubscription(data: BuySubscriptionRequest): Promise<void> {
    return withErrorHandling(() =>
      api.post<void, BuySubscriptionRequest>(`${SUBSCRIPTIONS_BASE}/buy`, data)
    );
  }

  /**
   * Buy per-unit subscription
   */
  async buyPerUnitSubscription(data: BuyPerUnitSubscriptionRequest): Promise<void> {
    return withErrorHandling(() =>
      api.post<void, BuyPerUnitSubscriptionRequest>(`${SUBSCRIPTIONS_BASE}/buy-per-unit`, data)
    );
  }

  /**
   * Get active subscription
   */
  async getActiveSubscription(): Promise<ActiveSubscription> {
    return withErrorHandling(() =>
      api.get<ActiveSubscription>(`${SUBSCRIPTIONS_BASE}/active`)
    );
  }

  /**
   * Get all subscription plans
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    return withErrorHandling(() =>
      api.get<SubscriptionPlan[]>(`${SUBSCRIPTIONS_BASE}/plans`)
    );
  }
}

export const subscriptionService = new SubscriptionService();
