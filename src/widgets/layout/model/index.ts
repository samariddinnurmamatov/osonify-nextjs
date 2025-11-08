/**
 * Layout Widget - Model Layer
 * 
 * Exports business logic, utilities, and hooks for the layout widget.
 * Following FSD architecture: model contains domain logic organized by concern.
 * 
 * @see https://feature-sliced.design/docs/get-started/overview
 */

// Types
export type {
  User,
  Team,
  BaseNavItem,
  NavLink,
  NavCollapsible,
  NavItem,
  NavGroup,
  SidebarData,
  ChatNavItem,
  ChatItemMetadata,
} from "./types";

// Utilities
export {
  stripLocale,
  normalizeUrl,
  checkIsActive,
  getInitials,
} from "./utils";

// Hooks
export { useHeaderScroll, useTeamSwitcher } from "./hooks";
