"use client";

/**
 * @file widgets/app-sidebar/ui/header-actions.tsx
 *
 * Purpose: Right-side header action slot — array of nodes, responsive layout.
 * Used in: `AppHeader`.
 * Used for: Desktop icon row; mobile overflow dropdown (same slotted items).
 *
 * Function Index:
 * - HeaderActions({ items }) → toolbar (md+) or more-menu (mobile)
 *
 * Steps:
 * 1. Empty items → render nothing.
 * 2. `md+`: lay out items in a horizontal toolbar.
 * 3. `<md`: More trigger → dropdown containing the same items.
 */

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type HeaderActionsProps = {
  /** Ordered action nodes (buttons, menus, placeholders). */
  items: readonly React.ReactNode[];
  className?: string;
  /** Accessible name for the actions group. */
  "aria-label"?: string;
};

function ActionList({
  items,
  className,
}: {
  items: readonly React.ReactNode[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex shrink-0 items-center">
          {item}
        </div>
      ))}
    </div>
  );
}

/**
 * Presentational slot: trailing header actions.
 * Desktop = inline toolbar; mobile = overflow dropdown with the same nodes.
 */
export function HeaderActions({
  items,
  className,
  "aria-label": ariaLabel = "Header actions",
}: HeaderActionsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("ml-auto shrink-0", className)}>
      {/* Desktop — inline toolbar */}
      <div
        className="hidden items-center md:flex"
        role="toolbar"
        aria-label={ariaLabel}
      >
        <ActionList items={items} />
      </div>

      {/* Mobile — same items in a more menu (`modal={false}` so theme menu can open) */}
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label={`Open ${ariaLabel.toLowerCase()}`}
              title={ariaLabel}
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem] p-2">
            <ActionList
              items={items}
              className="flex-col items-stretch gap-1 [&>div]:justify-center"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
