"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens, AuthResponse, AuthState } from "./types";

// Normalize user data
const normalizeUser = (rawUser: User | { user: User } | null | undefined): User => {
  if (!rawUser) return {} as User;
  const u = "user" in rawUser ? rawUser.user : rawUser;
  const userWithId = u as User & { _id?: string };
  return {
    ...u,
    id: userWithId._id ?? u.id,
  };
};

interface AuthStore extends AuthState {
  setAuth: (response: AuthResponse, userData: User) => void;
  updateTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      isRefreshing: false,

      setAuth: (response, userData) => {
        const normalizedUser = normalizeUser(userData);
        set({
          user: normalizedUser,
          tokens: response.token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Dispatch event for token updates (for WebSocket reconnect, etc.)
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("tokensUpdated", {
              detail: { newTokens: response.token },
            })
          );
        }
      },

      updateTokens: (tokens) => {
        const { tokens: oldTokens } = get();
        set({ tokens });

        // Dispatch event for token updates
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("tokensUpdated", {
              detail: { oldTokens, newTokens: tokens },
            })
          );
        }
      },

      clearAuth: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          isRefreshing: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

      setUser: (user) => set({ user: normalizeUser(user) }),

      initializeAuth: async () => {
        // Check if Telegram Mini App
        interface TelegramWindow extends Window {
          Telegram?: {
            WebApp?: {
              initData?: string;
            };
          };
        }
        const tgWindow = window as TelegramWindow;
        if (typeof window !== "undefined" && tgWindow.Telegram?.WebApp?.initData) {
          set({ isLoading: true });
          try {
            const { AuthService } = await import("../api/auth-service");
            const { userService } = await import("@/shared/api/services");
            
            const initData = tgWindow.Telegram.WebApp.initData;
            if (!initData) {
              set({ isAuthenticated: false, isLoading: false });
              return;
            }
            const authResponse = await AuthService.loginWithWebApp(initData);
            const profile = await userService.getProfile();
            
            get().setAuth(authResponse, profile);
            return;
          } catch (err) {
            console.error("MiniApp auth failed:", err);
            set({ isAuthenticated: false, isLoading: false });
            return;
          } finally {
            set({ isLoading: false });
          }
        }

        // Load from localStorage (handled by persist middleware)
        const { tokens, user } = get();
        if (tokens && user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

