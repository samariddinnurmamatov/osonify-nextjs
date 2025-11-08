"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/shared/ui/sidebar";
import type { BaseNavItem } from "../../model/types";
import { ChatItem } from "./chat-item";
import { LinkProps } from "next/link";

type ChatsGroupProps = {
  chats: Array<BaseNavItem & { url: LinkProps["href"]; metadata?: { meta?: string; timeAgo?: string } }>;
};

/**
 * Chats group component - renders collapsible chats section
 * Optimized for scrollable chat list
 */
export const ChatsGroup = memo(function ChatsGroup({ chats }: ChatsGroupProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname() ?? "";
  const isCollapsed = state === "collapsed" && !isMobile;

  if (isCollapsed) {
    // For collapsed state, render simple icon button
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Chats">
              <MessageSquare />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="flex flex-col !pb-0 !pt-0">
      <Collapsible defaultOpen={true} className="group/collapsible flex flex-col">
        <SidebarMenuItem className="flex-shrink-0">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <MessageSquare />
              <span>Chats</span>
              <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>
        <CollapsibleContent className="CollapsibleContent !mb-0 relative origin-top">
          <SidebarMenuSub className="!border-0 !mx-0 !px-0 !translate-x-0 !mb-0">
            {chats.map((chat) => (
              <ChatItem
                key={chat.title}
                item={chat}
                pathname={pathname}
                onItemClick={() => setOpenMobile(false)}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
});

