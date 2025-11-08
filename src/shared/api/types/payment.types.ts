/**
 * Payment Types
 */

export interface CreateOrderRequest {
  provider: string;
  amount: number;
  extra_data?: Record<string, unknown>;
}

export interface CreateOrderResponse {
  order_id: string;
  payment_url?: string;
  [key: string]: unknown;
}

export interface PaymeCallbackRequest {
  [key: string]: unknown;
}

export interface ClickCallbackRequest {
  [key: string]: unknown;
}

