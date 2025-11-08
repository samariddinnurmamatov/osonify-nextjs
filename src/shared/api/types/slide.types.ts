/**
 * Slide Types
 */

export interface SlideData {
  id: string;
  chat_id: string;
  content?: string;
  html?: string;
  [key: string]: unknown;
}

