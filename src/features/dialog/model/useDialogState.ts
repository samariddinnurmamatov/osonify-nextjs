"use client";

import { useCallback, useRef, useState } from "react";
import { areEqualKeys } from "./utils";
import type { DialogKey } from "./types";

export function useDialogState<T extends DialogKey = DialogKey>(
  initial: T | null = null
) {
  const isMountedRef = useRef(true);
  const [current, setCurrent] = useState<T | null>(initial);

  const open = useCallback((key: T) => {
    if (!isMountedRef.current) return;
    setCurrent(key);
  }, []);

  const close = useCallback(() => {
    if (!isMountedRef.current) return;
    setCurrent(null);
  }, []);

  const toggle = useCallback((key: T) => {
    if (!isMountedRef.current) return;
    setCurrent((prev) => (areEqualKeys(prev, key) ? null : key));
  }, []);

  const isOpen = useCallback((key: T) => areEqualKeys(current, key), [current]);

  return { current, open, close, toggle, isOpen } as const;
}




