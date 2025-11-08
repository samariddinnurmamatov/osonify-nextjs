import type { NavItem } from "../types";
import { stripLocale, normalizeUrl } from "./navigation.utils";

/**
 * Checks if a navigation item is active based on current pathname
 * Handles direct matches, sub-item matches, and parent segment matches
 * 
 * @param pathname - Current pathname
 * @param item - Navigation item to check
 * @param checkParent - Whether to check parent item for collapsible items
 * @returns True if item is active
 * 
 * @example
 * ```ts
 * checkIsActive("/dashboard", { url: "/dashboard", title: "Dashboard" }) // true
 * checkIsActive("/settings/profile", { url: "/settings", title: "Settings", items: [...] }, true) // true
 * ```
 */
export function checkIsActive(
  pathname: string,
  item: NavItem,
  checkParent = false
): boolean {
  const cleanPath = stripLocale(pathname).split("?")[0] || "/";
  const itemUrl = normalizeUrl("url" in item && item.url ? item.url : "/");
  const itemPath = itemUrl.split("?")[0] || "/";

  // Direct match
  if (cleanPath === itemPath) {
    return true;
  }

  // Check sub-items for collapsible items
  if ("items" in item && item.items) {
    const hasActiveChild = item.items.some(
      (subItem) =>
        stripLocale(normalizeUrl(subItem.url)).split("?")[0] === cleanPath
    );
    if (hasActiveChild) {
      return true;
    }
  }

  // Check parent segment match for collapsible items
  if (checkParent && "items" in item && item.items) {
    const cleanSegments = cleanPath.split("/").filter(Boolean);
    const itemSegments = itemPath.split("/").filter(Boolean);
    if (cleanSegments.length > 0 && itemSegments.length > 0) {
      return cleanSegments[0] === itemSegments[0];
    }
  }

  return false;
}

