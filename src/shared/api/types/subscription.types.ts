/**
 * Subscription Types
 */

export interface BuySubscriptionRequest {
  subscription_plan: string;
  subscription_type: string;
}

export interface BuyPerUnitSubscriptionRequest {
  service: string;
  count: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  plan: string;
  plan_type: string;
  price: number;
  duration: number;
  features: string[];
  [key: string]: unknown;
}

export interface ActiveSubscription {
  id: string;
  user_id: string;
  plan: string;
  plan_type: string;
  start_date: string;
  expire_date?: string;
  is_active: boolean;
  [key: string]: unknown;
}

