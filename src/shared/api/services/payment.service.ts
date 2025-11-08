/**
 * Payment Service
 * Handles payment-related API calls
 */

import { api } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  PaymeCallbackRequest,
  ClickCallbackRequest,
} from "../types/payment.types";

const PAYMENTS_BASE = "/api/v1/payments";

export class PaymentService {
  /**
   * Create payment order
   */
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return withErrorHandling(() =>
      api.post<CreateOrderResponse, CreateOrderRequest>(`${PAYMENTS_BASE}/orders`, data)
    );
  }

  /**
   * Handle Payme callback (usually called by Payme server)
   */
  async paymeCallback(
    data: PaymeCallbackRequest,
    authorization?: string
  ): Promise<Record<string, any>> {
    return withErrorHandling(() =>
      api.post<Record<string, any>, PaymeCallbackRequest>(
        `${PAYMENTS_BASE}/payme/callback`,
        data,
        {
          requireAuth: false,
          headers: authorization ? { Authorization: authorization } : undefined,
        }
      )
    );
  }

  /**
   * Handle Click callback (usually called by Click server)
   */
  async clickCallback(data: ClickCallbackRequest): Promise<Record<string, any>> {
    return withErrorHandling(() =>
      api.post<Record<string, any>, ClickCallbackRequest>(
        `${PAYMENTS_BASE}/click/callback`,
        data,
        { requireAuth: false }
      )
    );
  }
}

export const paymentService = new PaymentService();
