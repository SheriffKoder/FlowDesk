/**
 * @file views/customer-health/ui/cards/welcome/welcome-metrics.tsx
 *
 * Purpose: Three-cell metric strip under the welcome greeting.
 * Used in: `WelcomeCard`.
 * Used for: Portfolio snapshot (customers / MRR / avg health).
 */

import { cn } from "@/lib/utils";

import type { WelcomeMetric } from "./types";

export type WelcomeMetricsProps = {
  metrics: readonly WelcomeMetric[];
  className?: string;
};

/**
 * Equal-width metric cells in a single row.
 */
export function WelcomeMetrics({ metrics, className }: WelcomeMetricsProps) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <dl
      className={cn(
        "grid grid-cols-3 gap-2 border-t border-widget-border pt-3",
        className,
      )}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex min-w-0 flex-col gap-0.5 px-1 text-center sm:text-left"
        >
          <dt className="truncate text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
            {metric.label}
          </dt>
          <dd
            className="truncate text-sm font-semibold tabular-nums text-foreground sm:text-base"
            title={metric.valueLabel ?? metric.value}
          >
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
