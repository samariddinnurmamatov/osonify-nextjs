/**
 * Preset Types
 */

import { PaginationParams, PaginatedResponse } from "./common";

export interface CreatePresetRequest {
  title: string;
  prompt: string;
  model: string;
  model_display: string;
  image_ids: string[];
  image_limit: number;
  image_aspect_ratio?: string;
  is_active: boolean;
}

export interface UpdatePresetRequest {
  title: string;
  prompt: string;
  model: string;
  model_display: string;
  image_ids: string[];
  image_limit: number;
  image_aspect_ratio?: string;
  is_active: boolean;
}

export interface PresetData {
  id: string;
  title: string;
  prompt: string;
  model: string;
  model_display: string;
  image_limit: number;
  image_aspect_ratio: string;
  images: Array<{
    id: string;
    url: string;
    [key: string]: unknown;
  }>;
  liked_users: string[];
  like_count: number;
  is_active: boolean;
  is_liked: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PresetsListParams extends PaginationParams {
  model?: string;
}

export type PresetsListResponse = PaginatedResponse<PresetData>;

export interface ToggleLikePresetResponse {
  success: boolean;
  is_liked: boolean;
}

