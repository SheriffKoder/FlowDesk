/**
 * @file views/customer-health/ui/cards/segment-counts/segment-counts-card.tsx
 *
 * Purpose: Segment distribution overview — icon / label / bar / count rows.
 * Used in: `OverviewCardsRow`.
 * Used for: Show healthy / watch / at_risk totals at a glance.
 *
 * Layout (reference): flex-col of horizontal grids
 *   [icon] label | bar | number  — columns share fixed grid tracks.
 */

import { cn } from "@/lib/utils";
import type { StatusBadgeTone } from "@/shared/ui";

import { CardShell } from "../card-shell";
import type { SegmentCountRow, SegmentCountsCardProps } from "./types";

/////////////////////////////////////////////////////////////
// Tone → bar / icon chrome (domain-agnostic CSS vars)
/////////////////////////////////////////////////////////////

const TONE_BAR_CLASS: Record<StatusBadgeTone, string> = {
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  neutral: "bg-muted-foreground",
};

const TONE_ICON_BOX_CLASS: Record<StatusBadgeTone, string> = {
  success:
    "border-[var(--color-success)]/40 bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning:
    "border-[var(--color-warning)]/40 bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  error:
    "border-[var(--color-error)]/40 bg-[var(--color-error-light)] text-[var(--color-error)]",
  neutral: "border-border bg-muted text-muted-foreground",
};

/////////////////////////////////////////////////////////////
// Row
/////////////////////////////////////////////////////////////

type SegmentCountRowViewProps = {
  row: SegmentCountRow;
  /** Denominator for bar width (usually sum of all counts). */
  total: number;
};

function SegmentCountRowView({ row, total }: SegmentCountRowViewProps) {
  const Icon = row.icon;
  const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;

  return (
    <div
      className="grid grid-cols-[auto_minmax(4.5rem,7rem)_minmax(0,1fr)_auto] items-center gap-x-3"
      role="listitem"
    >
      <span
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-md border",
          TONE_ICON_BOX_CLASS[row.tone],
        )}
        aria-hidden
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </span>

      <span className="truncate text-sm font-medium text-foreground">
        {row.label}
      </span>

      <div
        className="h-1.5 min-w-0 overflow-hidden rounded-full bg-muted"
        role="presentation"
      >
        <div
          className={cn(
            "h-full rounded-full opacity-80 transition-[width]",
            TONE_BAR_CLASS[row.tone],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className="min-w-[2.5rem] text-right text-sm font-medium tabular-nums text-foreground">
        {row.count.toLocaleString()}
      </span>
    </div>
  );
}

/////////////////////////////////////////////////////////////
// Card
/////////////////////////////////////////////////////////////

/**
 * Vertical stack of segment count rows with proportional bars.
 */
export function SegmentCountsCard({
  rows,
  className,
}: SegmentCountsCardProps) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <CardShell
      aria-label="Customer segment counts"
      className={cn("justify-center gap-2.5", className)}
    >
      <div className="flex flex-col gap-2.5" role="list">
        {rows.map((row) => (
          <SegmentCountRowView key={row.segment} row={row} total={total} />
        ))}
      </div>
    </CardShell>
  );
}
