"use client";

import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/ui/separator";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import { useHeaderScroll } from "../../model";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  /** Whether the header should be fixed/sticky at the top */
  fixed?: boolean;
};

/**
 * Main header component with scroll-aware styling
 * 
 * Automatically adds shadow and backdrop blur effects when scrolled.
 * Uses memoization to prevent unnecessary re-renders.
 * Scroll logic is handled by useHeaderScroll hook from model layer.
 * 
 * @param props - Standard HTML header props plus fixed flag
 * 
 * @example
 * ```tsx
 * <Header fixed>
 *   <HeaderActions />
 * </Header>
 * ```
 */
export const Header = memo(function Header({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) {
  const offset = useHeaderScroll();
  const hasScrolled = offset > 10;

  return (
    <header
      className={cn(
        "z-50 h-16",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit] border-b",
        hasScrolled && fixed && "shadow",
        !hasScrolled && "shadow-none border-b",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 p-4 sm:gap-4",
          hasScrolled &&
            fixed &&
            "after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg"
        )}
      >
        <SidebarTrigger variant="outline" className="max-md:scale-125" />
        <Separator orientation="vertical" className="h-6" />
        {children}
      </div>
    </header>
  );
});

