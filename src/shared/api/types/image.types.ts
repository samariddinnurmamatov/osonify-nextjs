/**
 * Image Types
 */

import { PaginationParams, PaginatedResponse } from "./common";

export interface ImageConfig {
  models: Array<{
    id: string;
    name: string;
    display_name: string;
    styles?: string[];
    aspect_ratios?: string[];
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface ImageData {
  id: string;
  url: string;
  chat_id?: string;
  is_liked?: boolean;
  created_at?: string;
  [key: string]: any;
}

export interface ImagesListParams extends PaginationParams {}

export interface ImagesListResponse extends PaginatedResponse<ImageData> {}

export interface LikeImageResponse {
  success: boolean;
}

