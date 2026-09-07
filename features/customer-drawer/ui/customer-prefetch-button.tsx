"use client";

/**
 * @file features/customer-drawer/ui/customer-prefetch-button.tsx
 *
 * Purpose: Pill “Open” control beside the customer name (ADR-005 / Step 12).
 * Used in: Customer Health name column.
 * Used for: Hover/focus warms health cache; click opens details without
 *   stealing the row click (stopPropagation).
 *
 * Function Index:
 * - CustomerPrefetchButton(props) → Open + chevron pill
 *
 * Steps:
 * 1. On hover / focus → silent `prefetchCustomerHealth`.
 * 2. On click → stopPropagation + `onOpen` (row click still works elsewhere).
 */

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { prefetchCustomerHealth } from "../lib/prefetch-customer-health";

export type CustomerPrefetchButtonProps = {
  customerId: string;
  /** Used in the accessible name. */
  customerName: string;
  /** Open the details panel for this customer. */
  onOpen: () => void;
  className?: string;
  disabled?: boolean;
};

/**
 * Pill-shaped Open + chevron. Prefetch on intentional hover/focus only —
 * not on whole-row hover.
 */
export function CustomerPrefetchButton({
  customerId,
  customerName,
  onOpen,
  className,
  disabled = false,
}: CustomerPrefetchButtonProps) {
  const label = `Open details for ${customerName}`;

  const warmCache = () => {
    if (disabled) {
      return;
    }
    prefetchCustomerHealth(customerId);
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full border-b border-border px-2.5 text-xs font-medium text-muted-foreground",
        "transition-colors hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={warmCache}
      onFocus={warmCache}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
    >
      <span aria-hidden>Open</span>
      <ChevronRight className="size-3.5 shrink-0" aria-hidden />
    </button>
  );
}
