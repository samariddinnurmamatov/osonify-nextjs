"use client";

import { useToastStore, toast as toastHelper } from "../stores/toastStore";

/**
 * Hook for showing toast notifications
 * 
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast.success("Success!", "Operation completed");
 * toast.error("Error!", "Something went wrong");
 * ```
 */
export function useToast() {
  const { toasts, removeToast, clearAll } = useToastStore();

  return {
    toasts,
    toast: toastHelper,
    removeToast,
    clearAll,
  };
}

