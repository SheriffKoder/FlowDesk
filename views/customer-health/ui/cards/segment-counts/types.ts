/**
 * @file views/customer-health/ui/cards/segment-counts/types.ts
 *
 * Purpose: Prop shapes for the segment-counts overview card.
 * Used in: `SegmentCountsCard`, overview loaders / row.
 */

import type { LucideIcon } from "lucide-react";

import type { CustomerSegment } from "@/entities/customer";
import type { StatusBadgeTone } from "@/shared/ui";

export type SegmentCountRow = {
  segment: CustomerSegment;
  label: string;
  count: number;
  /** Bar + icon accent — mapped from segment at the call site. */
  tone: StatusBadgeTone;
  icon: LucideIcon;
};

export type SegmentCountsCardProps = {
  /** One row per segment (order = display order). */
  rows: readonly SegmentCountRow[];
  className?: string;
};
