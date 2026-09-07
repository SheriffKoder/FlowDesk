"use client";

/**
 * @file shared/ui/sort-button/sort-button.tsx
 *
 * Purpose: Dumb dual-triangle sort toggle for table header cells.
 * Used in: Customer Health column headers (and any sortable DataTable).
 * Used for: Visual + a11y affordance; no router/URL knowledge.
 *
 * Function Index:
 * - SortButton(props) → up/down filled-triangle button
 *
 * Steps:
 * 1. Derive active triangle + next-action title from `direction`.
 * 2. Emit `onToggle` on click (caller cycles / appends URL sorts).
 */

import { Triangle } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SortButtonProps } from "./types";

/**
 * Compact sort control: stacked filled triangles; active direction uses primary.
 * Optional priority badge for multi-level sorts. Adapted from url-kit SortButton.
 */
export function SortButton({
  direction,
  label,
  onToggle,
  className,
  disabled = false,
  priority = null,
}: SortButtonProps) {
  const isAscending = direction === "asc";
  const isDescending = direction === "desc";

  //////////////////////////////////
  // 1. Announce the next click action (none → asc → desc → remove).
  const sortActionTitle =
    direction === null
      ? `Sort by ${label}, ascending`
      : direction === "asc"
        ? `Sort by ${label}, descending`
        : `Clear sort for ${label}`;
  //////////////////////////////////

  return (
    <button
      type="button"
      className={cn(
        "ml-1 -mt-0.5 rounded p-1 transition-colors hover:bg-foreground/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      aria-label={sortActionTitle}
      title={sortActionTitle}
    >
      <span className="relative flex flex-col items-center gap-px" aria-hidden>
        <Triangle
          size={8}
          strokeWidth={0}
          fill="currentColor"
          className={cn(
            "transition-colors",
            isAscending ? "text-primary" : "text-muted-foreground/50",
          )}
        />
        <Triangle
          size={8}
          strokeWidth={0}
          fill="currentColor"
          className={cn(
            "rotate-180 transition-colors",
            isDescending ? "text-primary" : "text-muted-foreground/50",
          )}
        />
        {priority !== null && (
          <span className="absolute -right-1.5 -top-2 flex h-3 w-3 items-center justify-center rounded-full bg-muted-foreground text-[8px] font-medium text-background">
            {priority + 1}
          </span>
        )}
      </span>
    </button>
  );
}
