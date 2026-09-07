/**
 * @file Column definitions + empty copy for the Customer Health list table.
 *
 * Sortable headers compose shared `SortButton`; multi-level URL sorts stay in the shell.
 */

import { SortButton, type TableColumnDef } from "@/shared/ui";

import {
  listSortAriaForColumn,
  listSortDirectionForColumn,
  listSortLevelForColumn,
} from "../lib/next-list-sort";
import type { CustomerListRow } from "./customer-list-row";
import type { ListSortKey, ListSortSpec } from "./list-url-params";

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
// Sortable header chrome
/////////////////////////////////////////////////////////////

/** Table column id → URL `sort` key (`lastActive` → `last_active`). */
const COLUMN_SORT_KEYS = {
  name: "name",
  mrr: "mrr",
  lastActive: "last_active",
  health: "health",
  owner: "owner",
} as const satisfies Record<string, ListSortKey>;

type SortableColumnId = keyof typeof COLUMN_SORT_KEYS;

function sortableHeader(options: {
  label: string;
  columnId: SortableColumnId;
  sorts: readonly ListSortSpec[];
  onSortToggle: (key: ListSortKey) => void;
  isPending?: boolean;
}) {
  const sortKey = COLUMN_SORT_KEYS[options.columnId];
  const direction = listSortDirectionForColumn(options.sorts, sortKey);
  const priority = listSortLevelForColumn(options.sorts, sortKey);

  return (
    <div className="flex items-center justify-between gap-1">
      <span>{options.label}</span>
      <SortButton
        label={options.label}
        direction={direction}
        priority={priority}
        disabled={options.isPending}
        onToggle={() => {
          options.onSortToggle(sortKey);
        }}
      />
    </div>
  );
}

/////////////////////////////////////////////////////////////
// Columns
/////////////////////////////////////////////////////////////

export type BuildCustomerTableColumnsOptions = {
  sorts: readonly ListSortSpec[];
  onSortToggle: (key: ListSortKey) => void;
  isPending?: boolean;
};

/**
 * Build list columns with sortable headers wired to the current URL sorts.
 * Segment stays non-sortable (not in the URL `LIST_SORT_KEYS` allow-list).
 */
export function buildCustomerTableColumns({
  sorts,
  onSortToggle,
  isPending = false,
}: BuildCustomerTableColumnsOptions): TableColumnDef<CustomerListRow>[] {
  return [
    {
      id: "name",
      header: sortableHeader({
        label: "Name",
        columnId: "name",
        sorts,
        onSortToggle,
        isPending,
      }),
      ariaSort: listSortAriaForColumn(sorts, "name"),
      cell: (row) => formatName(row.name),
      className: "max-w-[14rem] truncate",
    },
    {
      id: "mrr",
      header: sortableHeader({
        label: "MRR",
        columnId: "mrr",
        sorts,
        onSortToggle,
        isPending,
      }),
      ariaSort: listSortAriaForColumn(sorts, "mrr"),
      cell: (row) => formatMrr(row.mrr),
      className: "tabular-nums",
    },
    {
      id: "lastActive",
      header: sortableHeader({
        label: "Last active",
        columnId: "lastActive",
        sorts,
        onSortToggle,
        isPending,
      }),
      ariaSort: listSortAriaForColumn(sorts, "last_active"),
      cell: (row) => formatLastActive(row.lastActive),
      className: "text-muted-foreground",
    },
    {
      id: "health",
      header: sortableHeader({
        label: "Health",
        columnId: "health",
        sorts,
        onSortToggle,
        isPending,
      }),
      ariaSort: listSortAriaForColumn(sorts, "health"),
      cell: (row) => String(row.health),
      className: "font-medium tabular-nums",
    },
    {
      id: "owner",
      header: sortableHeader({
        label: "Owner",
        columnId: "owner",
        sorts,
        onSortToggle,
        isPending,
      }),
      ariaSort: listSortAriaForColumn(sorts, "owner"),
      cell: (row) => formatOwner(row.owner),
    },
    {
      id: "segment",
      header: "Segment",
      cell: (row) => segmentLabels[row.segment],
    },
  ];
}

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
