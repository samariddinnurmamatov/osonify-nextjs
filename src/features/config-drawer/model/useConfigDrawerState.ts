"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const REOPEN_STORAGE_KEY = "config_drawer_reopen";

export function useConfigDrawerState() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(REOPEN_STORAGE_KEY) === "true";
  });
  const shouldStayOpenRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldReopen = sessionStorage.getItem(REOPEN_STORAGE_KEY);
    if (shouldReopen === "true") {
      setIsOpen(true);
      sessionStorage.removeItem(REOPEN_STORAGE_KEY);
    }
  }, []);

  const rememberReopen = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(REOPEN_STORAGE_KEY, "true");
  }, []);

  const clearReopen = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(REOPEN_STORAGE_KEY);
  }, []);

  const setShouldStayOpen = useCallback((value: boolean) => {
    shouldStayOpenRef.current = value;
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && shouldStayOpenRef.current) return;
    if (open || !shouldStayOpenRef.current) setIsOpen(open);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      handleOpenChange,
      setShouldStayOpen,
      rememberReopen,
      clearReopen,
    }),
    [isOpen, handleOpenChange, setShouldStayOpen, rememberReopen, clearReopen]
  );
}


