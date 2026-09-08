/**
 * @file views/customer-health/ui/cards/overview-cards-row.tsx
 *
 * Purpose: Horizontal overview strip — welcome + segment counts + placeholder.
 * Used in: `CustomerHealthPage` (above list toolbar/table).
 * Used for: One composition of three widget cards.
 *
 * Layout:
 * - Welcome + segment: share remaining width (`1fr` / `flex-1`)
 * - Placeholder: row height × square (`width = height`) in the `auto` track
 * - `<md`: welcome full width; segment + placeholder share one row at even widths
 * - `md+`: CSS grid `1fr 1fr auto` so row height is set by the first two cards
 *
 * Function Index:
 * - OverviewCardsRow({ welcomeMetrics, segmentCounts }) → card strip
 */

import { cn } from "@/lib/utils";

import { overviewWelcomeConfig } from "../../model/overview-cards-config";
import { PlaceholderCard } from "./placeholder";
import { SegmentCountsCard } from "./segment-counts";
import type { SegmentCountRow } from "./segment-counts";
import { WelcomeCard } from "./welcome";
import type { WelcomeMetric } from "./welcome";

export type OverviewCardsRowProps = {
  welcomeMetrics: readonly WelcomeMetric[];
  segmentCounts: readonly SegmentCountRow[];
  className?: string;
};

/**
 * Overview cards above the customer list widget.
 * First two size the row; placeholder is a height-matched square.
 */
export function OverviewCardsRow({
  welcomeMetrics,
  segmentCounts,
  className,
}: OverviewCardsRowProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-4",
        "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-stretch",
        className,
      )}
      aria-label="Customer health overview"
    >
      <WelcomeCard
        name={overviewWelcomeConfig.name}
        description={overviewWelcomeConfig.description}
        metrics={welcomeMetrics}
        className="min-w-0 md:h-full md:min-h-0"
      />

      {/* Mobile: even-width cards 2+3; md+: unwrap into the grid tracks */}
      <div className="grid min-h-0 min-w-0 grid-cols-2 items-stretch gap-4 md:contents">
        <SegmentCountsCard
          rows={segmentCounts}
          className="min-h-0 min-w-0 md:h-full"
        />
        <PlaceholderCard className="min-w-0 w-full md:w-auto" />
      </div>
    </div>
  );
}
