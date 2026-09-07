"use client";

/**
 * @file features/customer-drawer/ui/customer-details-panel.tsx
 *
 * Purpose: Customer details chrome wrapping shared `DetailsPanel`.
 * Used in: Customer Health list shell (beside the table).
 * Used for: Title + close; body placeholder until health fetch (Step 11).
 *
 * Function Index:
 * - CustomerDetailsPanel(props) → in-layout DetailsPanel
 */

import type { ReactNode } from "react";

import { DetailsPanel } from "@/shared/ui";

export type CustomerDetailsPanelProps = {
  open: boolean;
  /** Display title (usually customer name; falls back in the shell). */
  title: string;
  onClose: () => void;
  /** Optional body — health sections land in Step 11. */
  children?: ReactNode;
  className?: string;
};

/**
 * Feature-level details panel: shared shell + customer workflow copy defaults.
 */
export function CustomerDetailsPanel({
  open,
  title,
  onClose,
  children,
  className,
}: CustomerDetailsPanelProps) {
  return (
    <DetailsPanel
      open={open}
      title={title}
      onClose={onClose}
      className={className}
    >
      {children ?? (
        <p className="text-sm text-muted-foreground">
          Loading health details…
        </p>
      )}
    </DetailsPanel>
  );
}
