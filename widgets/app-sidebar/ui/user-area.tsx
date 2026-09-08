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
 *
 * Note: `new Date()` must not run during Client Component prerender
 * (Next.js blocking-prerender-current-time-client). Date is set after mount.
 */

import { useEffect, useState } from "react";

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

function toDateTimeAttr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Compact user chip for the layout header.
 */
export function UserArea({
  className,
  name = DEMO_USER.name,
  initials = DEMO_USER.initials,
}: UserAreaProps) {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const todayLabel = today ? formatHeaderDate(today) : null;
  const dateTime = today ? toDateTimeAttr(today) : undefined;

  return (
    <div
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      aria-label={todayLabel ? `${name}, ${todayLabel}` : name}
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
          {todayLabel && dateTime ? (
            <time dateTime={dateTime}>{todayLabel}</time>
          ) : (
            <span className="invisible" aria-hidden>
              {/* Reserve line height until mount to avoid layout jump */}
              Monday 1 Jan 2000
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
