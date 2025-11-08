/**
 * Payment Types
 */

export interface CreateOrderRequest {
  provider: string;
  amount: number;
  extra_data?: Record<string, any>;
}

export interface CreateOrderResponse {
  order_id: string;
  payment_url?: string;
  [key: string]: any;
}

export interface PaymeCallbackRequest {
  [key: string]: any;
}

export interface ClickCallbackRequest {
  [key: string]: any;
}

