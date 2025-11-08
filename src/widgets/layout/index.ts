/**
 * Layout Widget - Public API
 * 
 * Following FSD architecture principles:
 * - Widgets expose only UI components and public types
 * - Internal implementation details (model, data) are not exported
 * - All components are optimized with memoization
 * 
 * @see https://feature-sliced.design/docs/get-started/overview
 */

// UI Components
export * from "./ui";

// Public Types (following FSD: only export what's needed by other layers)
export type {
  SidebarData,
  NavGroup as NavGroupType,
  NavItem,
  NavCollapsible,
  NavLink,
  User,
  Team,
} from "./model/types";
