/**
 * Slide Service
 * Handles slide-related API calls
 */

import { api } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import type { SlideData } from "../types/slide.types";

const SLIDES_BASE = "/api/v1/slides";

export class SlideService {
  /**
   * Get slide by chat ID
   */
  async getSlideByChatId(chatId: string): Promise<SlideData> {
    return withErrorHandling(() => api.get<SlideData>(`${SLIDES_BASE}/${chatId}`));
  }
}

export const slideService = new SlideService();
