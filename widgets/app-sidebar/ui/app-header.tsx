"use client";

/**
 * @file widgets/app-sidebar/ui/app-header.tsx
 *
 * Purpose: Top layout header — page identity left; actions + user area right.
 * Used in: `AppShell` (above page children).
 * Used for: Title/description from URL; slotted actions; demo user chip.
 *
 * Function Index:
 * - AppHeader(props) → semantic header chrome
 *
 * Steps:
 * 1. Resolve current page via `getCurrentPage(pathname)`.
 * 2. Left: page icon + title + description.
 * 3. Right: {@link HeaderActions}, vertical spacer, {@link UserArea}.
 */

import { Bell, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

import { getCurrentPage } from "../lib/get-current-page";
import { APP_CHROME_BRAND_HEIGHT } from "../model/chrome";
import { HeaderActionIcon } from "./header-action-icon";
import { HeaderActions } from "./header-actions";
import { UserArea } from "./user-area";

export type AppHeaderProps = {
  className?: string;
  /**
   * Action nodes for the trailing slot. Defaults to theme switcher plus
   * notifications / messages (disabled).
   */
  actions?: readonly React.ReactNode[];
};

const DEFAULT_HEADER_ACTIONS: readonly React.ReactNode[] = [
  <ThemeSwitcher key="theme" />,
  <HeaderActionIcon
    key="notifications"
    icon={Bell}
    label="Notifications"
    disabled
  />,
  <HeaderActionIcon
    key="messages"
    icon={MessageSquare}
    label="Messages"
    disabled
  />,
];

/**
 * Layout header aligned with the sidebar brand block height.
 * Unknown routes still keep the chrome bar (actions + user remain available).
 */
export function AppHeader({
  className,
  actions = DEFAULT_HEADER_ACTIONS,
}: AppHeaderProps) {
  const pathname = usePathname() ?? "/";
  const page = getCurrentPage(pathname);
  const Icon = page?.icon;

  return (
    <header
      className={cn(
        "flex shrink-0 items-center gap-3.5 border-b border-border/40 bg-background px-6 py-3",
        APP_CHROME_BRAND_HEIGHT,
        className,
      )}
    >
      {page && Icon ? (
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <span
            className="squircle relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-white/80"
            aria-hidden
          >
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-black/20 to-black/40"
              aria-hidden
            />
            <Icon className="relative z-10 size-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
              {page.label}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {page.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="min-w-0 flex-1" />
      )}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <HeaderActions items={actions} className="ml-0" />
        <div
          className="h-8 w-px shrink-0 bg-muted-foreground/20"
          aria-hidden
        />
        <UserArea />
      </div>
    </header>
  );
}
