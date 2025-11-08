"use client";

import { memo, useMemo } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import useDialogState from "@/shared/hooks/use-dialog-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import type { User } from "../../model";
import { getInitials } from "../../model";

type NavUserProps = {
  /** User data to display */
  user: User;
};

/**
 * Navigation user component
 * 
 * Displays user profile in the sidebar footer with dropdown menu for account actions.
 * Includes user avatar, name, email, and various account management links.
 * Uses getInitials utility from model layer for avatar fallback.
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <NavUser user={{ name: "John Doe", email: "john@example.com", avatar: "/avatar.jpg" }} />
 * ```
 */
export const NavUser = memo(function NavUser({ user }: NavUserProps) {
  const { isMobile, state } = useSidebar();
  const [open, setOpen] = useDialogState();

  const initials = useMemo(() => getInitials(user.name), [user.name]);

  const handleSignOut = useMemo(() => () => setOpen(true), [setOpen]);

  // Determine dropdown side based on mobile/desktop and sidebar state
  const dropdownSide = useMemo(() => {
    if (isMobile) {
      return "bottom";
    }
    // Desktop: if sidebar is expanded (open), open top; if collapsed, open right
    return state === "expanded" ? "top" : "right";
  }, [isMobile, state]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ms-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={dropdownSide}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles className="mr-2 size-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings/account">
                    <BadgeCheck className="mr-2 size-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <CreditCard className="mr-2 size-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/notifications">
                    <Bell className="mr-2 size-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Uncomment when SignOutDialog is implemented */}
      {/* <SignOutDialog open={!!open} onOpenChange={setOpen} /> */}
    </>
  );
});

