/**
 * Storage Types
 */

export interface UploadFilesResponse {
  file_ids: string[];
}

export interface GetFilesParams {
  file_ids: string[];
}

export interface FileData {
  id: string;
  url: string;
  filename?: string;
  size?: number;
  content_type?: string;
  [key: string]: unknown;
}

export interface GetFilesResponse {
  files: FileData[];
}

export interface DeleteFilesParams {
  file_ids: string[];
}

export interface DeleteFilesResponse {
  success: boolean;
}

