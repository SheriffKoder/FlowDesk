/**
 * @file widgets/app-sidebar/model/nav-config.ts
 *
 * Purpose: App chrome nav items for the slim icon sidebar.
 * Used in: `AppSidebar` (desktop rail + mobile bottom bar).
 * Used for: Single source of truth for url / icon / disabled / label.
 */

import {
  HeartPulse,
  Inbox,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  id: string;
  /** Accessible name (tooltip + aria-label). */
  label: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
};

/**
 * Primary app destinations. Disabled entries render as non-links.
 * Extend here when new routes land — do not hard-code icons in the UI.
 */
export const appNavItems: readonly AppNavItem[] = [
  {
    id: "health",
    label: "Customer Health",
    url: "/customers/health",
    icon: HeartPulse,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    disabled: true,
  },
  {
    id: "inbox",
    label: "Inbox",
    url: "/inbox",
    icon: Inbox,
    disabled: true,
  },
  {
    id: "settings",
    label: "Settings",
    url: "/settings",
    icon: Settings,
    disabled: true,
  },
] as const;
