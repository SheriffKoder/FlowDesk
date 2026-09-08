/**
 * @file shared/ui/status-badge/status-badge.tsx
 *
 * Purpose: Dumb status pill — leading dot + label + tone colors.
 * Used in: Table cells / filters that need a semantic status chip.
 * Used for: Present a tone without knowing domain enums (invoice, segment, …).
 */

import {
  STATUS_BADGE_DOT_CLASS,
  statusBadgeClassName,
} from "./lib/color-map";

import type { StatusBadgeProps } from "./types";

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span className={statusBadgeClassName(tone, className)}>
      <span className={STATUS_BADGE_DOT_CLASS} aria-hidden="true" />
      {children}
    </span>
  );
}
