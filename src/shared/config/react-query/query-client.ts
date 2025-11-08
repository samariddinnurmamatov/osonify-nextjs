"use client";
import { QueryClient, QueryCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // keep cache for 30 minutes
      networkMode: "online",
      structuralSharing: true,
    },
    mutations: {
      networkMode: "online",
      retry: 1,
      retryDelay: 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("❌ React Query error:", error);
    },
  }),
});
