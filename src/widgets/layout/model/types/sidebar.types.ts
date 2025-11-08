import type { LinkProps } from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * User data structure for sidebar navigation
 * Contains user profile information displayed in the sidebar footer
 */
export type User = {
  /** User's display name */
  name: string;
  /** User's email address */
  email: string;
  /** URL to user's avatar image */
  avatar: string;
};

/**
 * Team/Organization data structure
 * Represents a team or organization that can be switched in the sidebar
 */
export type Team = {
  /** Team name */
  name: string;
  /** Lucide icon component for team logo */
  logo: LucideIcon;
  /** Team plan or description */
  plan: string;
};

/**
 * Base navigation item properties
 * Common properties shared by all navigation item types
 */
export type BaseNavItem = {
  /** Navigation item title/label */
  title: string;
  /** Optional badge text to display next to the item */
  badge?: string;
  /** Optional Lucide icon component */
  icon?: LucideIcon;
};

/**
 * Simple navigation link item
 * Represents a single navigation link without sub-items
 */
export type NavLink = BaseNavItem & {
  /** URL or route path for the navigation item */
  url: LinkProps["href"];
  /** Ensures items is never present on NavLink */
  items?: never;
};

/**
 * Chat item metadata for displaying time and additional info
 */
export type ChatItemMetadata = {
  /** Time ago string (e.g., "22h ago", "2 days ago") */
  timeAgo?: string;
  /** Additional metadata like "prompt" or message preview */
  meta?: string;
};

/**
 * Chat navigation item (extends base with metadata)
 */
export type ChatNavItem = BaseNavItem & {
  /** URL or route path for the chat item */
  url: LinkProps["href"];
  /** Chat-specific metadata */
  metadata?: ChatItemMetadata;
  /** Ensures items is never present on ChatNavItem */
  items?: never;
};

/**
 * Collapsible navigation item with sub-items
 * Represents a navigation group that can be expanded/collapsed
 */
export type NavCollapsible = BaseNavItem & {
  /** Array of sub-navigation items (can be regular items or chat items with metadata) */
  items: (BaseNavItem & { url: LinkProps["href"]; metadata?: ChatItemMetadata })[];
  /** Ensures url is never present on NavCollapsible */
  url?: never;
  /** Special flag for chats section to remove vertical border */
  isChatsSection?: boolean;
};

/**
 * Union type for all navigation items
 * Can be either a simple link or a collapsible group
 */
export type NavItem = NavCollapsible | NavLink;

/**
 * Navigation group containing multiple items
 * Groups related navigation items together with a title
 */
export type NavGroup = {
  /** Group title/label */
  title: string;
  /** Array of navigation items in this group */
  items: NavItem[];
};

/**
 * Complete sidebar data structure
 * Contains all data needed to render the application sidebar
 */
export type SidebarData = {
  /** Current user information */
  user: User;
  /** Available teams/organizations for switching */
  teams: Team[];
  /** Navigation groups to display in the sidebar */
  navGroups: NavGroup[];
};

