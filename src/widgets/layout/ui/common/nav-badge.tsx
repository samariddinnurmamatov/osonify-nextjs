"use client";

import { memo } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/badge";

/**
 * Navigation badge component
 * 
 * Displays a small badge next to navigation items.
 * Used internally by navigation components to show notifications or counts.
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <NavBadge>3</NavBadge>
 * <NavBadge>New</NavBadge>
 * ```
 */
export const NavBadge = memo(function NavBadge({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Badge className="rounded-full px-1 py-0 text-xs" variant="secondary">
      {children}
    </Badge>
  );
});

