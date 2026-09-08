/**
 * @file shared/ui/status-badge/types.ts
 *
 * Purpose: Props for the dumb StatusBadge pill.
 */

import type { ReactNode } from "react";

import type { StatusBadgeTone } from "./lib/color-map";

export type StatusBadgeProps = {
  /** Semantic tone — map domain status → tone at the call site. */
  tone: StatusBadgeTone;
  /** Visible label (required so status is never color-only). */
  children: ReactNode;
  className?: string;
};
