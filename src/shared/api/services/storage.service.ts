/**
 * Storage Service
 * Handles file storage-related API calls
 */

import { api } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import type {
  UploadFilesResponse,
  GetFilesParams,
  GetFilesResponse,
  DeleteFilesParams,
  DeleteFilesResponse,
  FileData,
} from "../types/storage.types";

const STORAGE_BASE = "/api/v1/storage";

export class StorageService {
  /**
   * Upload files
   */
  async uploadFiles(files: File[]): Promise<UploadFilesResponse> {
    if (files.length === 0) {
      return { file_ids: [] };
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return withErrorHandling(() => {
      return api.post<UploadFilesResponse, FormData>(`${STORAGE_BASE}/upload`, formData, {
        isFormData: true,
      });
    });
  }

  /**
   * Get files by IDs
   */
  async getFiles(params: GetFilesParams): Promise<GetFilesResponse> {
    return withErrorHandling(() => {
      const searchParams = new URLSearchParams();
      params.file_ids.forEach((id) => {
        searchParams.append("file_ids", id);
      });

      return api.get<GetFilesResponse>(`${STORAGE_BASE}/get?${searchParams.toString()}`);
    });
  }

  /**
   * Get single file by ID
   */
  async getFile(fileId: string): Promise<FileData> {
    return withErrorHandling(() => api.get<FileData>(`${STORAGE_BASE}/get/${fileId}`));
  }

  /**
   * Delete files by IDs
   */
  async deleteFiles(params: DeleteFilesParams): Promise<DeleteFilesResponse> {
    return withErrorHandling(() => {
      const searchParams = new URLSearchParams();
      params.file_ids.forEach((id) => {
        searchParams.append("file_ids", id);
      });

      return api.delete<DeleteFilesResponse>(`${STORAGE_BASE}/delete?${searchParams.toString()}`);
    });
  }
}

export const storageService = new StorageService();
