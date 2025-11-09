/**
 * Chat Service
 * Handles chat-related API calls
 */

import { BaseService } from "../base/BaseService";
import { buildQuery } from "../utils/query";
import { api } from "../client";
import { withErrorHandling } from "../interceptors/error-handler";
import type {
  CreateChatRequest,
  CreateChatResponse,
  ChatData,
  ChatsListParams,
  ChatsListResponse,
} from "../types/chat.types";

const ENDPOINT = "/api/v1/chats";

export class ChatService extends BaseService<ChatData, CreateChatRequest, Partial<ChatData>> {
  protected endpoint = ENDPOINT;

  /**
   * Create a new chat
   */
  async createChat(data: CreateChatRequest) {
    return this.create<CreateChatResponse>(data);
  }

  /**
   * Get all chats with pagination
   */
  async getChats(params: ChatsListParams = {}) {
    return this.list<ChatsListResponse>(params);
  }

  /**
   * Get trashed chats
   */
  async getTrashedChats(params: ChatsListParams = {}) {
    return withErrorHandling(() => {
      const query = buildQuery(params);
      return api.get<ChatsListResponse>(`${ENDPOINT}/trashes${query}`);
    });
  }

  /**
   * Trash, restore, or delete a chat
   * @param chatId - Chat ID
   * @param action - 0 = trash, 1 = restore, 2 = delete permanently
   */
  async updateChat(chatId: string, action: 0 | 1 | 2) {
    return withErrorHandling(() => {
      return api.put<void>(`${ENDPOINT}/${chatId}?action=${action}`, undefined);
    });
  }

  /**
   * Trash a chat (convenience method)
   */
  async trashChat(chatId: string) {
    return this.updateChat(chatId, 0);
  }

  /**
   * Restore a chat (convenience method)
   */
  async restoreChat(chatId: string) {
    return this.updateChat(chatId, 1);
  }

  /**
   * Delete a chat permanently (convenience method)
   */
  async deleteChat(chatId: string) {
    return this.updateChat(chatId, 2);
  }
}

export const chatService = new ChatService();
