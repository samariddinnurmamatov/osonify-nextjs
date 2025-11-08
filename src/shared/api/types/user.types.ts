/**
 * User Types
 */

export interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  avatar?: string;
  telegram_id?: number;
  language?: string;
  interface_lang?: string;
  interface_theme?: "light" | "dark" | "system";
  balance?: number;
  points?: number;
  is_used_free_trial?: boolean;
  refer_count?: number;
  university_name?: string;
  group_name?: string;
  policy_accepted?: boolean;
  is_admin?: boolean;
  inviter_id?: number;
  created_at?: string;
  updated_at?: string;
  plan?: {
    user_id: string;
    plan: string;
    plan_type: string;
    expenses?: unknown[];
    created_at: string;
    expire_date?: string;
    id: string;
  };
}

export interface UpdateUserRequest {
  interface_lang?: string;
  interface_theme?: "light" | "dark" | "system";
  [key: string]: unknown;
}

export interface UpdateUserResponse {
  id: string;
}

