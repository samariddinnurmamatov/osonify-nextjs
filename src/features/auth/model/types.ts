/**
 * Auth Types
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
  interface_theme?: string;
  balance?: number;
  points?: number;
  is_used_free_trial?: boolean;
  refer_count?: number;
  university_name?: string;
  group_name?: string;
  policy_accepted?: boolean;
  is_admin?: boolean;
  inviter_id?: number | null;
  created_at?: string;
  updated_at?: string;
  plan?: {
    user_id: string;
    plan: string;
    plan_type: string;
    expenses?: any[];
    created_at: string;
    expire_date?: string;
    id: string;
  };
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  id: string;
  token: AuthTokens;
  user?: User | { user: User };
}

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
}

