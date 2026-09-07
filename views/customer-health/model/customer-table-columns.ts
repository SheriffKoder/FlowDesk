/**
 * @file Column definitions + empty copy for the Customer Health list table.
 */

import type { TableColumnDef } from "@/shared/ui";

import type { CustomerListRow } from "./customer-list-row";

/////////////////////////////////////////////////////////////
// Display formatters (view-local — keep DataTable dumb)
/////////////////////////////////////////////////////////////

/** Segment enum → short label shown in the Segment column. */
const segmentLabels = {
  healthy: "Healthy",
  watch: "Watch",
  at_risk: "At risk",
} as const;

/**
 * Format MRR as whole USD (e.g. `$12,500`).
 * Non-finite values render as an em dash so the cell never shows `NaN`.
 */
function formatMrr(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format last-active ISO timestamp as a short US date (e.g. `Mar 4, 2026`).
 * Empty or unparseable strings fall back to an em dash.
 */
function formatLastActive(iso: string): string {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** Trim owner; blank → em dash so empty CS ownership stays readable. */
function formatOwner(owner: string): string {
  const trimmed = owner.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

/** Trim name; blank → em dash (defensive — fixtures always have names). */
function formatName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

/////////////////////////////////////////////////////////////
// Columns
/////////////////////////////////////////////////////////////

export const customerTableColumns: TableColumnDef<CustomerListRow>[] = [
  {
    id: "name",
    header: "Name",
    cell: (row) => formatName(row.name),
    className: "max-w-[14rem] truncate",
  },
  {
    id: "mrr",
    header: "MRR",
    cell: (row) => formatMrr(row.mrr),
    className: "tabular-nums",
  },
  {
    id: "lastActive",
    header: "Last active",
    cell: (row) => formatLastActive(row.lastActive),
    className: "text-muted-foreground",
  },
  {
    id: "health",
    header: "Health",
    cell: (row) => String(row.health),
    className: "font-medium tabular-nums",
  },
  {
    id: "owner",
    header: "Owner",
    cell: (row) => formatOwner(row.owner),
  },
  {
    id: "segment",
    header: "Segment",
    cell: (row) => segmentLabels[row.segment],
  },
];

/////////////////////////////////////////////////////////////
// Empty copy
/////////////////////////////////////////////////////////////

/** No customers in the system / unfiltered result set. */
export const customerTableTrueEmptyMessage =
  "No customers yet. When accounts are added, they will show up here.";

/** Customers exist but none match search/segment. */
export const customerTableFilteredEmptyMessage =
  "No customers match your search or filters.";

/** @deprecated Prefer true/filtered constants — kept for older call sites. */
export const customerTableEmptyMessage = customerTableTrueEmptyMessage;
