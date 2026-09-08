/**
 * @file views/customer-health/server/load-overview-cards.ts
 *
 * Purpose: Server helper — portfolio snapshot for overview cards (one fixture pass).
 * Used in: `app/customers/health/page.tsx` → `OverviewCardsRow`.
 * Used for: Welcome metrics + segment counts without self-HTTP / N+1 list probes.
 *
 * Function Index:
 * - loadOverviewCards() → { welcomeMetrics, segmentCounts }
 *
 * Steps:
 * 1. Load all customers (`listCustomers` with pageSize = total).
 * 2. Aggregate customers / MRR / avg health → welcome metric cells.
 * 3. Count by segment → segment-counts card rows (+ chrome from config).
 */

import {
  CUSTOMER_SEGMENTS,
  listCustomers,
  type CustomerListItem,
  type CustomerSegment,
} from "@/entities/customer";

import {
  formatMetricAvgHealth,
  formatMetricCount,
  formatMetricMrrUsd,
} from "../lib/format-overview-metric";
import { segmentCountChrome } from "../model/overview-cards-config";
import type { SegmentCountRow } from "../ui/cards/segment-counts";
import type { WelcomeMetric } from "../ui/cards/welcome";

export type OverviewCardsData = {
  welcomeMetrics: WelcomeMetric[];
  segmentCounts: SegmentCountRow[];
};

/////////////////////////////////////////////////////////////
// Aggregates
/////////////////////////////////////////////////////////////

function loadAllCustomers(): CustomerListItem[] {
  const probe = listCustomers({
    search: "",
    segments: [],
    page: 1,
    pageSize: 1,
    sort: { kind: "default" },
  });

  if (probe.total === 0) {
    return [];
  }

  const pageSize = Math.max(probe.total, 1);
  return listCustomers({
    search: "",
    segments: [],
    page: 1,
    pageSize,
    sort: { kind: "default" },
  }).data;
}

function buildWelcomeMetrics(rows: CustomerListItem[]): WelcomeMetric[] {
  const customers = rows.length;
  const totalMrr = rows.reduce((sum, row) => sum + row.mrr, 0);
  const avgHealth =
    customers === 0
      ? Number.NaN
      : rows.reduce((sum, row) => sum + row.health, 0) / customers;

  return [
    {
      label: "Customers",
      value: formatMetricCount(customers),
      valueLabel: `${customers} customers`,
    },
    {
      label: "MRR",
      value: formatMetricMrrUsd(totalMrr),
      valueLabel: `$${totalMrr.toLocaleString()} monthly recurring revenue`,
    },
    {
      label: "Avg health",
      value: formatMetricAvgHealth(avgHealth),
      valueLabel: Number.isFinite(avgHealth)
        ? `Average health score ${Math.round(avgHealth)} of 100`
        : "Average health unavailable",
    },
  ];
}

function buildSegmentCounts(rows: CustomerListItem[]): SegmentCountRow[] {
  const counts = Object.fromEntries(
    CUSTOMER_SEGMENTS.map((segment) => [segment, 0]),
  ) as Record<CustomerSegment, number>;

  for (const row of rows) {
    counts[row.segment] += 1;
  }

  return CUSTOMER_SEGMENTS.map((segment) => {
    const chrome = segmentCountChrome[segment];
    return {
      segment,
      label: chrome.label,
      count: counts[segment],
      tone: chrome.tone,
      icon: chrome.icon,
    };
  });
}

/////////////////////////////////////////////////////////////
// Public loader
/////////////////////////////////////////////////////////////

/**
 * Load overview card data from the unfiltered customer portfolio.
 *
 * Ignores list URL filters so cards stay a stable snapshot while the table
 * below remains filterable.
 */
export function loadOverviewCards(): OverviewCardsData {
  const rows = loadAllCustomers();

  return {
    welcomeMetrics: buildWelcomeMetrics(rows),
    segmentCounts: buildSegmentCounts(rows),
  };
}
