"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useUserStore } from "@/entities/user/model";

export function UserHydrationProvider({ children }: { children: ReactNode }) {
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      useUserStore.getState().hydrateFromCookies();
      hydrated.current = true;
    }
  }, []);

  return <>{children}</>;
}
