"use client";

/**
 * @file widgets/app-sidebar/ui/app-sidebar.tsx
 *
 * Purpose: Slim icon rail (desktop left) + horizontal icon bar (mobile bottom).
 * Used in: `AppShell` / root layout.
 * Used for: Navigate primary app destinations from {@link appNavItems}.
 *
 * Function Index:
 * - AppSidebar({ variant }) → rail | dock
 *
 * Steps:
 * 1. Resolve active item from pathname.
 * 2. Rail: logo block (fixed height) + vertical icon list + logout footer.
 * 3. Dock: horizontal icons + logout (no logo).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Workflow } from "lucide-react";

import { cn } from "@/lib/utils";

import { appNavItems, type AppNavItem } from "../model/nav-config";
import {
  APP_CHROME_BRAND_HEIGHT,
  APP_CHROME_RAIL_WIDTH,
} from "../model/chrome";

export type AppSidebarVariant = "rail" | "dock";

export type AppSidebarProps = {
  /** `rail` = left desktop; `dock` = bottom mobile. */
  variant: AppSidebarVariant;
  className?: string;
};

/////////////////////////////////////////////////////////////
// Shared icon control
/////////////////////////////////////////////////////////////

function NavIcon({
  item,
  active,
  size = "sm",
}: {
  item: AppNavItem;
  active: boolean;
  /** Dock uses larger hit targets. */
  size?: "sm" | "lg";
}) {
  const Icon = item.icon;
  const isLarge = size === "lg";
  const className = cn(
    "inline-flex shrink-0 items-center justify-center rounded-lg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isLarge ? "size-11" : "size-9",
    item.disabled && "pointer-events-none opacity-40",
    !item.disabled &&
      (active
        ? "button-active"
        : "text-muted-foreground transition-colors hover:bg-accent/70 hover:text-accent-foreground"),
  );

  if (item.disabled) {
    return (
      <span className={className} aria-disabled="true" title={item.label}>
        <Icon className={isLarge ? "size-5" : "size-4"} aria-hidden />
        <span className="sr-only">{item.label} (unavailable)</span>
      </span>
    );
  }

  return (
    <Link
      href={item.url}
      className={className}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      title={item.label}
    >
      <Icon className={isLarge ? "size-5" : "size-4"} aria-hidden />
    </Link>
  );
}

function isActivePath(pathname: string, url: string): boolean {
  if (url === "/") {
    return pathname === "/";
  }
  return pathname === url || pathname.startsWith(`${url}/`);
}

function NavIconList({
  pathname,
  size = "sm",
}: {
  pathname: string;
  size?: "sm" | "lg";
}) {
  return (
    <>
      {appNavItems.map((item) => (
        <NavIcon
          key={item.id}
          item={item}
          size={size}
          active={isActivePath(pathname, item.url)}
        />
      ))}
    </>
  );
}

function LogoutButton({ size = "sm" }: { size?: "sm" | "lg" }) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg text-destructive",
        "transition-colors hover:bg-destructive/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
        isLarge ? "size-11" : "size-9",
      )}
      aria-label="Log out"
      title="Log out"
      onClick={() => {
        // Demo chrome — wire to auth when available.
      }}
    >
      <LogOut className={isLarge ? "size-5" : "size-4"} aria-hidden />
    </button>
  );
}

/////////////////////////////////////////////////////////////
// Sidebar
/////////////////////////////////////////////////////////////

/**
 * App chrome nav. Use `rail` on desktop (left) and `dock` on mobile (bottom).
 */
export function AppSidebar({ variant, className }: AppSidebarProps) {
  const pathname = usePathname() ?? "/";

  if (variant === "dock") {
    return (
      <nav
        className={cn(
          "flex h-16 w-full shrink-0 items-center justify-around border-t border-border/40 bg-white px-4 dark:bg-background",
          className,
        )}
        aria-label="Main"
      >
        <NavIconList pathname={pathname} size="lg" />
        <LogoutButton size="lg" />
      </nav>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border/40 dark:bg-transparent bg-white",
        APP_CHROME_RAIL_WIDTH,
        className,
      )}
      aria-label="Primary"
    >
      {/* Master mark — fixed-height brand block (matches AppHeader) */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center border-b border-border/40",
          APP_CHROME_BRAND_HEIGHT,
        )}
      >
        <Link
          href="/customers/health"
          className="flex size-9 items-center justify-center rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="FlowDesk home"
          title="FlowDesk"
        >
          <Workflow className="size-5" aria-hidden />
        </Link>
      </div>

      <nav
        className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-4"
        aria-label="Main"
      >
        <NavIconList pathname={pathname} />
      </nav>

      <div className="flex shrink-0 items-center justify-center py-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
