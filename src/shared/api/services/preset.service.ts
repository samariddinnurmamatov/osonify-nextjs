/**
 * Preset Service
 * Handles preset-related API calls
 */

import { BaseService, type ListParams } from "../base/BaseService";
import { buildQuery } from "../utils/query";
import { api } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import type {
  CreatePresetRequest,
  UpdatePresetRequest,
  PresetData,
  PresetsListParams,
  PresetsListResponse,
  ToggleLikePresetResponse,
} from "../types/preset.types";

const ENDPOINT = "/api/v1/presets";

export class PresetService extends BaseService<PresetData, CreatePresetRequest, UpdatePresetRequest> {
  protected endpoint = ENDPOINT;

  /**
   * Create a new preset
   */
  async createPreset(data: CreatePresetRequest) {
    return this.create<PresetData>(data);
  }

  /**
   * Get all presets with pagination
   */
  async getPresets(params: PresetsListParams = {}) {
    return this.list<PresetsListResponse>(params as ListParams);
  }

  /**
   * Get preset by ID
   */
  async getPresetById(presetId: string) {
    return this.get<PresetData>(presetId);
  }

  /**
   * Update preset
   */
  async updatePreset(presetId: string, data: UpdatePresetRequest) {
    return this.update<PresetData>(presetId, data);
  }

  /**
   * Delete preset
   */
  async deletePreset(presetId: string) {
    return this.delete(presetId);
  }

  /**
   * Toggle like preset
   */
  async toggleLikePreset(presetId: string) {
    return withErrorHandling(() => {
      return api.post<ToggleLikePresetResponse>(`${ENDPOINT}/${presetId}/like`, undefined);
    });
  }

  /**
   * Get user's liked presets
   */
  async getLikedPresets(params: Omit<PresetsListParams, "model"> = {}) {
    return withErrorHandling(() => {
      const query = buildQuery(params as Record<string, unknown>);
      return api.get<PresetsListResponse>(`${ENDPOINT}/user/liked${query}`);
    });
  }
}

export const presetService = new PresetService();
