"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Share,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";

import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/shared/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { checkIsActive } from "../../model";
import type { ChatNavItem } from "../../model/types";

type ChatItemProps = {
  item: ChatNavItem;
  pathname: string;
  onItemClick?: () => void;
};

/**
 * Chat item component for displaying chat conversations in sidebar
 * Shows chat title, time info, and settings menu on hover
 */
export const ChatItem = memo(function ChatItem({
  item,
  pathname,
  onItemClick,
}: ChatItemProps) {
  const { setOpenMobile, isMobile } = useSidebar();
  const isActive = checkIsActive(pathname, item);

  const handleClick = useMemo(
    () => () => {
      setOpenMobile(false);
      onItemClick?.();
    },
    [setOpenMobile, onItemClick]
  );

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share chat:", item.title);
  };

  const handleRename = () => {
    // TODO: Implement rename functionality
    console.log("Rename chat:", item.title);
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    console.log("Archive chat:", item.title);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete chat:", item.title);
  };

  return (
    <SidebarMenuSubItem
      className="group/chat-item relative"
    >
      <SidebarMenuSubButton
        asChild
        isActive={isActive}
        className="flex items-start gap-2 px-2 py-2 h-auto pr-8"
      >
        <Link href={item.url} onClick={handleClick}>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{item.title}</div>
            {(item.metadata?.timeAgo || item.metadata?.meta) && (
              <div className="text-xs text-sidebar-foreground/60 mt-0.5 flex items-center gap-1.5">
                {item.metadata?.meta && (
                  <span className="truncate">{item.metadata.meta}</span>
                )}
                {item.metadata?.timeAgo && (
                  <>
                    {item.metadata?.meta && <span>·</span>}
                    <span>{item.metadata.timeAgo}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </Link>
      </SidebarMenuSubButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 transition-opacity data-[state=open]:opacity-100 ${
              isMobile ? "opacity-100" : "opacity-0 group-hover/chat-item:opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Chat settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" sideOffset={8}>
          <DropdownMenuItem onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRename}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuSubItem>
  );
});

