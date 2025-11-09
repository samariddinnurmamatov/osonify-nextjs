/**
 * Image Service
 * Handles image-related API calls
 */

import { api } from "../client";
import { buildQuery } from "../utils/query";
import { withErrorHandling } from "../interceptors/error-handler";
import type {
  ImageConfig,
  ImagesListParams,
  ImagesListResponse,
  LikeImageResponse,
} from "../types/image.types";

const IMAGES_BASE = "/api/v1/images";

export class ImageService {
  /**
   * Get image AI model configurations
   */
  async getImageConfigs(): Promise<ImageConfig> {
    return api.get<ImageConfig>(`${IMAGES_BASE}/image-ai-model-configs`);
  }

  /**
   * Get user's images
   */
  async getMyImages(params: ImagesListParams = {}): Promise<ImagesListResponse> {
    return withErrorHandling(() => {
      const query = buildQuery(params);
      return api.get<ImagesListResponse>(`${IMAGES_BASE}/my${query}`);
    });
  }

  /**
   * Get all public images
   */
  async getAllImages(params: ImagesListParams = {}): Promise<ImagesListResponse> {
    return withErrorHandling(() => {
      const query = buildQuery(params);
      return api.get<ImagesListResponse>(`${IMAGES_BASE}/all${query}`);
    });
  }

  /**
   * Get liked images
   */
  async getLikedImages(params: ImagesListParams = {}): Promise<ImagesListResponse> {
    return withErrorHandling(() => {
      const query = buildQuery(params);
      return api.get<ImagesListResponse>(`${IMAGES_BASE}/liked${query}`);
    });
  }

  /**
   * Like an image
   */
  async likeImage(imageId: string, chatId?: string): Promise<LikeImageResponse> {
    const query = chatId ? `?chat_id=${encodeURIComponent(chatId)}` : "";
    return withErrorHandling(() => {
      return api.post<LikeImageResponse>(`${IMAGES_BASE}/like/${imageId}${query}`, undefined);
    });
  }

  /**
   * Unlike an image
   */
  async unlikeImage(imageId: string): Promise<LikeImageResponse> {
    return withErrorHandling(() => {
      return api.delete<LikeImageResponse>(`${IMAGES_BASE}/like/${imageId}`);
    });
  }
}

export const imageService = new ImageService();
