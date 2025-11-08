"use client";

import { useMemo } from "react";
import { useDialogState as useDialogStateAdvanced } from "@/features/dialog/model";

/**
 * Backward-compatible wrapper: returns tuple [open, setOpen].
 * Internally uses the advanced dialog state for stability and performance.
 */
export default function useDialogState<T extends string | boolean>(
  initialState: T | null = null
) {
  const state = useDialogStateAdvanced<T>(initialState);
  const tuple = useMemo(() => {
    const setOpen = (next: T | null) =>
      next === null ? state.close() : state.toggle(next);
    return [state.current, setOpen] as const;
  }, [state]);

  return tuple;
}

export { useDialogStateAdvanced };
