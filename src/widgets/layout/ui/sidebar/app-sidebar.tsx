"use client";

import { memo, useMemo } from "react";
import { useLayout } from "@/app/providers/layout";
import { sidebarData } from "../../data";
import { NavGroup } from "../navigation/nav-group";
import { ChatsGroup } from "../navigation/chats-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/ui/sidebar";

/**
 * Main application sidebar component
 * 
 * Displays the complete sidebar structure including:
 * - Team switcher in header
 * - Navigation groups in content area
 * - User profile in footer
 * 
 * The sidebar adapts its appearance based on layout settings (collapsible, variant)
 * from the LayoutProvider context.
 * Data is imported from data layer following FSD architecture.
 * 
 * @example
 * ```tsx
 * <AppSidebar />
 * ```
 * 
 * @see {@link useLayout} for layout configuration
 * @see {@link sidebarData} for sidebar data structure (from data layer)
 */
export const AppSidebar = memo(function AppSidebar() {
  const { collapsible, variant } = useLayout();

  const chatsGroup = useMemo(
    () => sidebarData.navGroups.find((group) => group.title === "Chats"),
    []
  );

  const chats = useMemo(() => {
    if (!chatsGroup || !chatsGroup.items[0] || !("items" in chatsGroup.items[0])) {
      return [];
    }
    const firstItem = chatsGroup.items[0];
    if ("items" in firstItem && firstItem.items) {
      return firstItem.items;
    }
    return [];
  }, [chatsGroup]);

  const otherGroups = useMemo(
    () => sidebarData.navGroups.filter((group) => group.title !== "Chats"),
    []
  );

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
        {/* 
          Alternative: Use AppTitle instead of TeamSwitcher
          <AppTitle />
        */}
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <div className="flex-shrink-0">
          {otherGroups.map((group: typeof sidebarData.navGroups[0]) => (
            <NavGroup key={group.title} {...group} />
          ))}
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          {chats.length > 0 && <ChatsGroup chats={chats} />}
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

