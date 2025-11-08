/**
 * Sidebar navigation data configuration
 * 
 * Pure data module following FSD architecture principles.
 * This file contains static configuration data for the sidebar.
 * No business logic or computations should be present here.
 */

import {
  LayoutDashboard,
  ListTodo,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
  MessageSquare,
} from "lucide-react";

import type { SidebarData } from "../../model/types";
import type { ChatItemMetadata } from "../../model";

/**
 * Sidebar data configuration
 * 
 * Contains user info, teams, and navigation structure.
 * This is the source of truth for sidebar configuration.
 * 
 * @example
 * ```ts
 * import { sidebarData } from '@/widgets/layout/data/config/sidebar.config';
 * // Use sidebarData.user, sidebarData.teams, sidebarData.navGroups
 * ```
 */
export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: ListTodo,
        },
      ],
    },
    {
      title: "Chats",
      items: [
        {
          title: "Chats",
          icon: MessageSquare,
          isChatsSection: true,
          items: [
            {
              title: "Salom suhbatiga kirish",
              url: "/chat/salom",
              metadata: {
                meta: "prompt",
                timeAgo: "22h ago",
              } as ChatItemMetadata,
            },
            {
              title: "Flex layout optimization",
              url: "/chat/flex-layout",
              metadata: {
                meta: "prompt",
                timeAgo: "1d ago",
              } as ChatItemMetadata,
            },
            {
              title: "Telegram Premium sovg'asi",
              url: "/chat/telegram-premium",
              metadata: {
                meta: "prompt",
                timeAgo: "2d ago",
              } as ChatItemMetadata,
            },
            {
              title: "Rasmni remov qilish",
              url: "/chat/rasmni-remov",
              metadata: {
                meta: "prompt",
                timeAgo: "3d ago",
              } as ChatItemMetadata,
            },
            {
              title: "Code review request",
              url: "/chat/code-review",
              metadata: {
                meta: "prompt",
                timeAgo: "4d ago",
              } as ChatItemMetadata,
            },
            {
              title: "FSD compliance review",
              url: "/chat/fsd-compliance",
              metadata: {
                meta: "prompt",
                timeAgo: "5d ago",
              } as ChatItemMetadata,
            },
            {
              title: "FSD refaktoringi tahlili",
              url: "/chat/fsd-refaktoring",
              metadata: {
                meta: "prompt",
                timeAgo: "1w ago",
              } as ChatItemMetadata,
            },
            {
              title: "Red theme update",
              url: "/chat/red-theme",
              metadata: {
                meta: "prompt",
                timeAgo: "1w ago",
              } as ChatItemMetadata,
            },
            {
              title: "Yangilangan Header dizayni",
              url: "/chat/header-dizayn",
              metadata: {
                meta: "prompt",
                timeAgo: "2w ago",
              } as ChatItemMetadata,
            },
            {
              title: "Next.js arxitektura optimizatsi",
              url: "/chat/nextjs-optimization",
              metadata: {
                meta: "prompt",
                timeAgo: "2w ago",
              } as ChatItemMetadata,
            },
          ],
        },
      ],
    },
  ],
};

