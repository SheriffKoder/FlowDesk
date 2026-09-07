/**
 * @file widgets/app-sidebar/model/page-config.ts
 *
 * Purpose: Metadata for App Router pages shown in layout chrome.
 * Used in: `getCurrentPage`, `AppHeader`, `nav-config` (sidebar icons).
 * Used for: Single source of truth for icon / label / description / url.
 */

import {
  HeartPulse,
  Inbox,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AppPageConfig = {
  id: string;
  label: string;
  /** Short supporting line under the title in the layout header. */
  description: string;
  url: string;
  icon: LucideIcon;
  /** When true, sidebar shows a non-link (still matchable by URL). */
  disabled?: boolean;
  /**
   * When false, omit from the icon sidebar / dock.
   * Defaults to true.
   */
  showInNav?: boolean;
};

/**
 * Known app pages. Extend here when adding routes — header + nav read this.
 */
export const appPages: readonly AppPageConfig[] = [
  {
    id: "health",
    label: "Customer Health",
    description:
      "See which accounts need attention, then open one for events, usage, and notes.",
    url: "/customers/health",
    icon: HeartPulse,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview of workspace activity and key metrics.",
    url: "/",
    icon: LayoutDashboard,
    disabled: true,
  },
  {
    id: "inbox",
    label: "Inbox",
    description: "Follow-ups and messages that need a response.",
    url: "/inbox",
    icon: Inbox,
    disabled: true,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Workspace preferences and account options.",
    url: "/settings",
    icon: Settings,
    disabled: true,
  },
] as const;
