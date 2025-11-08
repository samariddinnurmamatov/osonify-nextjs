"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hook to track scroll offset for header styling
 * 
 * Monitors window scroll position and provides the current offset.
 * Optimized with passive event listeners for better performance.
 * 
 * @returns Current scroll offset in pixels
 * 
 * @example
 * ```tsx
 * const offset = useHeaderScroll();
 * const hasScrolled = offset > 10;
 * ```
 */
export function useHeaderScroll(): number {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    setOffset(scrollTop);
  }, []);

  useEffect(() => {
    // Use window scroll event for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return offset;
}

