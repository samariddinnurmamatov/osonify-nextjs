/**
 * Chat Types
 */

import { PaginationParams, PaginatedResponse } from "./common";

export type ChatStatus = "pending" | "processing" | "completed" | "failed";

export interface ChatMetadata {
  language?: string;
  count?: number;
  model?: string;
  style?: string;
  aspect_ratio?: string;
  [key: string]: unknown;
}

export interface CreateChatRequest {
  service: string;
  user_id?: string;
  topic: string;
  description?: string;
  metadata?: ChatMetadata;
}

export interface CreateChatResponse {
  id: string;
}

export interface ChatData {
  id: string;
  user_id: string;
  topic: string;
  description?: string;
  service: string;
  status?: ChatStatus;
  language?: string;
  count?: number;
  rating?: number;
  is_trashed?: boolean;
  is_public?: boolean;
  created_at: string;
  updated_at?: string;
  [key: string]: unknown;
}

export type ChatsListParams = PaginationParams;

export type ChatsListResponse = PaginatedResponse<ChatData>;

