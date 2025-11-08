"use client";

import { memo, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

/**
 * Toggle sidebar button component
 * Handles sidebar toggle functionality with proper event handling
 */
const ToggleSidebar = memo(function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      toggleSidebar();
    },
    [onClick, toggleSidebar]
  );

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("aspect-square size-8 max-md:scale-125", className)}
      onClick={handleClick}
      aria-label="Toggle Sidebar"
      {...props}
    >
      <X className="md:hidden" aria-hidden="true" />
      <Menu className="max-md:hidden" aria-hidden="true" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});

/**
 * Application title component
 * 
 * Displays app name and logo in the sidebar header.
 * Includes a toggle button for mobile sidebar control.
 * Automatically closes mobile sidebar when title is clicked.
 * 
 * @example
 * ```tsx
 * <AppTitle />
 * ```
 */
export const AppTitle = memo(function AppTitle() {
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div>
            <Link
              href="/"
              onClick={handleLinkClick}
              className="grid flex-1 text-start text-sm leading-tight"
            >
              <span className="truncate font-bold">Shadcn-Admin</span>
              <span className="truncate text-xs">Vite + ShadcnUI</span>
            </Link>
            <ToggleSidebar />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});

