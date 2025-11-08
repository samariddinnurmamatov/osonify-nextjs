"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type {
  NavCollapsible,
  NavItem,
  NavLink,
  NavGroup as NavGroupProps,
  ChatNavItem,
} from "../../model";
import { checkIsActive } from "../../model";
import { NavBadge } from "../common/nav-badge";
import { ChatItem } from "./chat-item";

/**
 * Single navigation link item component
 * Renders a simple navigation link without sub-items
 */
const SidebarMenuLink = memo(function SidebarMenuLink({
  item,
  pathname,
}: {
  item: NavLink;
  pathname: string;
}) {
  const { setOpenMobile } = useSidebar();
  const t = useTranslations("Navigation");

  const isActive = checkIsActive(pathname, item);
  const translatedTitle = useMemo(() => t(item.title.toLowerCase()), [t, item.title]);

  const handleClick = useMemo(
    () => () => setOpenMobile(false),
    [setOpenMobile]
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={translatedTitle}
      >
        <Link href={item.url} onClick={handleClick}>
          {item.icon && <item.icon />}
          <span>{translatedTitle}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

/**
 * Collapsible navigation item component
 * Renders a navigation item with expandable sub-items
 */
const SidebarMenuCollapsible = memo(function SidebarMenuCollapsible({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(pathname, item, true);

  const handleClick = useMemo(
    () => () => setOpenMobile(false),
    [setOpenMobile]
  );

  // Check if this is a chats section (no vertical border)
  const isChatsSection = item.isChatsSection;

  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub
            className={isChatsSection ? "!border-0 !mx-0 !px-0 !translate-x-0" : ""}
          >
            {item.items.map((subItem) => {
              const subIsActive = checkIsActive(pathname, subItem);
              
              // Check if this is a chat item (has metadata)
              if ("metadata" in subItem && subItem.metadata) {
                return (
                  <ChatItem
                    key={subItem.title}
                    item={subItem as ChatNavItem}
                    pathname={pathname}
                    onItemClick={handleClick}
                  />
                );
              }
              
              // Regular sub item
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={subIsActive}>
                    <Link href={subItem.url} onClick={handleClick}>
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
});

/**
 * Collapsed dropdown navigation item component
 * Renders a dropdown menu for collapsible items when sidebar is collapsed
 */
const SidebarMenuCollapsedDropdown = memo(function SidebarMenuCollapsedDropdown({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) {
  const isActive = checkIsActive(pathname, item);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const subIsActive = checkIsActive(pathname, sub);
            return (
              <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                <Link
                  href={sub.url}
                  className={subIsActive ? "bg-secondary" : ""}
                >
                  {sub.icon && <sub.icon />}
                  <span className="max-w-52 text-wrap">{sub.title}</span>
                  {sub.badge && (
                    <span className="ms-auto text-xs">{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
});

/**
 * Main navigation group component
 * 
 * Renders a group of navigation items with proper active state handling.
 * Automatically adapts rendering based on sidebar state (collapsed/expanded).
 * 
 * @param props - Navigation group props
 * 
 * @example
 * ```tsx
 * <NavGroup title="General" items={[...]} />
 * ```
 */
export const NavGroup = memo(function NavGroup({
  title,
  items,
}: NavGroupProps) {
  const { state, isMobile } = useSidebar();
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "";
  const t = useTranslations("Navigation");

  const translatedTitle = useMemo(() => t(title.toLowerCase()), [t, title]);
  const isCollapsed = state === "collapsed" && !isMobile;
  const isChatsGroup = title === "Chats";
  const isGeneralGroup = title === "General";

  return (
    <SidebarGroup>
      {!isChatsGroup && !isGeneralGroup && <SidebarGroupLabel>{translatedTitle}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${
            typeof item.url === "string"
              ? item.url
              : JSON.stringify("url" in item ? item.url : {})
          }`;

          // Render simple link
          if (!("items" in item) || !item.items) {
            return (
              <SidebarMenuLink
                key={key}
                item={item as NavLink}
                pathname={pathname}
              />
            );
          }

          // Render collapsed dropdown for mobile/collapsed state
          if (isCollapsed) {
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                pathname={pathname}
              />
            );
          }

          // Render collapsible menu
          return (
            <SidebarMenuCollapsible key={key} item={item} pathname={pathname} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});

