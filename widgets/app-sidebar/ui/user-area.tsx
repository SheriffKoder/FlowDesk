"use client";

/**
 * @file widgets/app-sidebar/ui/user-area.tsx
 *
 * Purpose: Header trailing identity — avatar (+ name/date from `sm` up).
 * Used in: `AppHeader` (after actions + vertical spacer).
 * Used for: Hard-wired demo user for now; date is live; text hidden on mobile.
 *
 * Function Index:
 * - UserArea(props?) → avatar (+ name/date column on `sm+`)
 */

import { cn } from "@/lib/utils";

import { formatHeaderDate } from "../lib/format-header-date";

/** Demo identity until auth lands. */
const DEMO_USER = {
  name: "Alex Rivera",
  initials: "AR",
} as const;

export type UserAreaProps = {
  className?: string;
  /** Override display name (defaults to demo user). */
  name?: string;
  /** Override avatar initials (defaults from name / demo). */
  initials?: string;
};

/**
 * Compact user chip for the layout header.
 */
export function UserArea({
  className,
  name = DEMO_USER.name,
  initials = DEMO_USER.initials,
}: UserAreaProps) {
  const today = new Date();
  const todayLabel = formatHeaderDate(today);
  const dateTime = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      aria-label={`${name}, ${todayLabel}`}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-xs font-semibold text-primary ring-1 ring-border"
        aria-hidden
      >
        {initials}
      </span>
      <div className="hidden min-w-0 flex-col sm:flex">
        <p className="truncate text-sm font-medium leading-tight text-foreground">
          {name}
        </p>
        <p className="truncate text-xs leading-tight text-muted-foreground">
          <time dateTime={dateTime}>{todayLabel}</time>
        </p>
      </div>
    </div>
  );
}
