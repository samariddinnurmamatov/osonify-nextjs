"use client";

import { memo } from "react";

// Import from feature slices per FSD public API
import { ThemeSwitch } from "@/features/theme-switch";
import { LanguageSwitch } from "@/features/language-switch";
import { ConfigDrawer } from "@/features/config-drawer";
import { ProfileDropdown } from "@/features/user-profile-dropdown";

/**
 * Header actions component
 * 
 * Groups all header action buttons (theme, language, config, profile).
 * Memoized to prevent unnecessary re-renders when parent components update.
 * 
 * All child components are imported from feature slices following FSD architecture.
 * 
 * @example
 * ```tsx
 * <Header>
 *   <HeaderActions />
 * </Header>
 * ```
 */
export const HeaderActions = memo(function HeaderActions() {
  return (
    <div className="ms-auto flex items-center gap-4">
      <LanguageSwitch />
      <ThemeSwitch />
      <ConfigDrawer />
      <ProfileDropdown />
    </div>
  );
});

