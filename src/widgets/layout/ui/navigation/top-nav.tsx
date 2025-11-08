"use client";

import { memo, useMemo } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type TopNavLink = {
  /** Link title/label */
  title: string;
  /** Link URL */
  href: string;
  /** Whether this link is currently active */
  isActive: boolean;
  /** Whether this link is disabled */
  disabled?: boolean;
};

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  /** Array of navigation links to display */
  links: TopNavLink[];
};

/**
 * Top navigation component
 * 
 * Responsive navigation bar with mobile dropdown menu and desktop horizontal links.
 * Automatically filters out disabled links.
 * 
 * @param props - Standard HTML nav element props plus links array
 * 
 * @example
 * ```tsx
 * <TopNav links={[
 *   { title: "Home", href: "/", isActive: true },
 *   { title: "About", href: "/about", isActive: false }
 * ]} />
 * ```
 */
export const TopNav = memo(function TopNav({
  className,
  links,
  ...props
}: TopNavProps) {
  const enabledLinks = useMemo(
    () => links.filter((link) => !link.disabled),
    [links]
  );

  return (
    <>
      {/* Mobile dropdown menu */}
      <div className="lg:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="md:size-7" aria-label="Open navigation menu">
              <Menu className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {enabledLinks.map((link) => (
              <DropdownMenuItem key={`${link.title}-${link.href}`} asChild>
                <Link
                  href={link.href}
                  className={!link.isActive ? "text-muted-foreground" : ""}
                >
                  {link.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop horizontal navigation */}
      <nav
        className={cn(
          "hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6",
          className
        )}
        {...props}
      >
        {enabledLinks.map((link) => (
          <Link
            key={`${link.title}-${link.href}`}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              !link.isActive && "text-muted-foreground"
            )}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </>
  );
});

