export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  id: string;
  token: AuthTokens;
}

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface LogoutRequest {
  access_token: string;
  refresh_token: string;
}

export interface LogoutResponse {
  message: string;
}

