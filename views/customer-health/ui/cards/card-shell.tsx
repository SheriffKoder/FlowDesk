/**
 * @file views/customer-health/ui/cards/card-shell.tsx
 *
 * Purpose: Shared widget chrome for overview cards.
 * Used in: Welcome / segment-counts / placeholder cards.
 * Used for: Match list + details panel surface (widget bg/border).
 *           Dark mode uses top-lit gradient rim (`.widget-surface`).
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CardShellProps = {
  children?: ReactNode;
  className?: string;
  /** Optional landmark / region label. */
  "aria-label"?: string;
};

/**
 * Rounded widget surface used by overview cards.
 */
export function CardShell({
  children,
  className,
  "aria-label": ariaLabel,
}: CardShellProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "widget-surface flex min-h-[7.5rem] min-w-0 flex-1 flex-col overflow-hidden rounded-xl p-4",
        className,
      )}
    >
      {children}
    </section>
  );
}
