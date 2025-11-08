"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCookie, setCookie } from "@/shared/lib/cookies";

interface UserState {
  user: { id: string; name: string } | null;
  setUser: (user: UserState["user"]) => void;
  hydrateFromCookies: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
        if (user) setCookie("user_id", user.id, 86400 * 30);
      },
      hydrateFromCookies: () => {
        const id = getCookie("user_id");
        if (id) set({ user: { id, name: "Unknown" } });
      },
    }),
    {
      name: "user-storage",
      skipHydration: false,
    }
  )
);




