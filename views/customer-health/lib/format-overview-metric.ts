/**
 * @file views/customer-health/lib/format-overview-metric.ts
 *
 * Purpose: Pure formatters for welcome-card portfolio metrics.
 * Used in: `loadOverviewCards`.
 * Used for: Compact display values (count / currency / score).
 *
 * Function Index:
 * - formatMetricCount(n) → locale integer string
 * - formatMetricMrrUsd(centsOrDollars) → `$1.2k` / `$12,500`
 * - formatMetricAvgHealth(score) → rounded 0–100
 */

/**
 * Whole-number count for metric cells.
 */
export function formatMetricCount(value: number): string {
  return Math.round(value).toLocaleString();
}

/**
 * Compact USD for portfolio MRR (fixture values are whole dollars).
 * Under 10k → `$4,200`; 10k+ → `$12.5k`.
 */
export function formatMetricMrrUsd(mrr: number): string {
  if (!Number.isFinite(mrr) || mrr === 0) {
    return "$0";
  }

  const abs = Math.abs(mrr);
  if (abs >= 10_000) {
    const compact = abs / 1000;
    const rounded =
      compact >= 100 ? Math.round(compact).toString() : compact.toFixed(1);
    return `${mrr < 0 ? "-" : ""}$${rounded.replace(/\.0$/, "")}k`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(mrr);
}

/**
 * Average health score for display (0–100).
 */
export function formatMetricAvgHealth(avg: number): string {
  if (!Number.isFinite(avg)) {
    return "—";
  }
  return Math.round(avg).toLocaleString();
}
