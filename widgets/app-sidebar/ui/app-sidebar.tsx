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
 * 2. Rail: logo block (fixed height) + vertical icon list.
 * 3. Dock: horizontal scrollable icons only (no logo).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { appNavItems, type AppNavItem } from "../model/nav-config";

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
    "inline-flex shrink-0 items-center justify-center rounded-lg transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isLarge ? "size-11" : "size-9",
    item.disabled && "pointer-events-none opacity-40",
    !item.disabled &&
      (active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground"),
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
          "flex h-16 w-full shrink-0 items-center justify-around border-t border-border/40 bg-background px-4",
          className,
        )}
        aria-label="Main"
      >
        <NavIconList pathname={pathname} size="lg" />
      </nav>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full w-16 shrink-0 flex-col border-r border-border/40 bg-background",
        className,
      )}
      aria-label="Primary"
    >
      {/* Master mark — fixed-height brand block */}
      <div className="flex h-14 shrink-0 items-center justify-center border-b border-border/40">
        <Link
          href="/customers/health"
          className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="FlowDesk home"
          title="FlowDesk"
        >
          F
        </Link>
      </div>

      <nav
        className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-3"
        aria-label="Main"
      >
        <NavIconList pathname={pathname} />
      </nav>
    </aside>
  );
}
