/**
 * @file widgets/app-sidebar/model/nav-config.ts
 *
 * Purpose: Sidebar / dock items derived from {@link appPages}.
 * Used in: `AppSidebar`.
 * Used for: Keep nav icons in sync with page chrome metadata.
 */

import { appPages, type AppPageConfig } from "./page-config";

export type AppNavItem = {
  id: string;
  /** Accessible name (tooltip + aria-label). */
  label: string;
  url: string;
  icon: AppPageConfig["icon"];
  disabled?: boolean;
};

/**
 * Primary app destinations shown in the icon rail / dock.
 * Driven by `appPages` where `showInNav !== false`.
 */
export const appNavItems: readonly AppNavItem[] = appPages
  .filter((page) => page.showInNav !== false)
  .map((page) => ({
    id: page.id,
    label: page.label,
    url: page.url,
    icon: page.icon,
    disabled: page.disabled,
  }));
