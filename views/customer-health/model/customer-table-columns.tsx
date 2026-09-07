/**
 * @file Column definitions + empty copy for the Customer Health list table.
 *
 * Columns are built from {@link customerHealthListConfig} + entity field catalog.
 * Sortable headers compose shared `SortButton`; multi-level URL sorts stay in the shell.
 */

import {
  CUSTOMER_LIST_FIELDS,
  customerSegmentLabel,
  type CustomerListItem,
} from "@/entities/customer";
import { SortButton, type TableColumnDef } from "@/shared/ui";

import {
  listSortAriaForColumn,
  listSortDirectionForColumn,
  listSortLevelForColumn,
} from "../lib/next-list-sort";
import type { CustomerListRow } from "./customer-list-row";
import {
  customerHealthListConfig,
  type CustomerHealthCellFormat,
  type CustomerHealthColumnConfig,
} from "./list-config";
import type { ListSortKey, ListSortSpec } from "./list-url-params";

/////////////////////////////////////////////////////////////
// Display formatters (view-local — keep DataTable dumb)
/////////////////////////////////////////////////////////////

/**
 * Format MRR as whole USD (e.g. `$12,500`).
 * Non-finite values render as an em dash so the cell never shows `NaN`.
 */
function formatCurrencyUsd(value: number): string {
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
 * Format ISO timestamp as a short US date (e.g. `Mar 4, 2026`).
 * Empty or unparseable strings fall back to an em dash.
 */
function formatShortDate(iso: string): string {
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

/** Trim string; blank → em dash. */
function formatText(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

/**
 * Resolve a cell string from format id + row path (from catalog).
 */
function formatCell(
  format: CustomerHealthCellFormat,
  row: CustomerListItem,
  path: keyof CustomerListItem,
): string {
  const raw = row[path];

  switch (format) {
    case "text":
      return formatText(String(raw ?? ""));
    case "currencyUsd":
      return formatCurrencyUsd(typeof raw === "number" ? raw : Number(raw));
    case "shortDate":
      return formatShortDate(String(raw ?? ""));
    case "number":
      return String(raw);
    case "segmentLabel":
      return customerSegmentLabel(row.segment);
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}

/////////////////////////////////////////////////////////////
// Sortable header chrome
/////////////////////////////////////////////////////////////

function sortableHeader(options: {
  label: string;
  sortKey: ListSortKey;
  sorts: readonly ListSortSpec[];
  onSortToggle: (key: ListSortKey) => void;
  isPending?: boolean;
}) {
  const direction = listSortDirectionForColumn(options.sorts, options.sortKey);
  const priority = listSortLevelForColumn(options.sorts, options.sortKey);

  return (
    <div className="flex items-center justify-between gap-1">
      <span>{options.label}</span>
      <SortButton
        label={options.label}
        direction={direction}
        priority={priority}
        disabled={options.isPending}
        onToggle={() => {
          options.onSortToggle(options.sortKey);
        }}
      />
    </div>
  );
}

/////////////////////////////////////////////////////////////
// Columns — driven by list-config
/////////////////////////////////////////////////////////////

export type BuildCustomerTableColumnsOptions = {
  sorts: readonly ListSortSpec[];
  onSortToggle: (key: ListSortKey) => void;
  isPending?: boolean;
};

function buildColumn(
  column: CustomerHealthColumnConfig,
  options: BuildCustomerTableColumnsOptions,
): TableColumnDef<CustomerListRow> {
  const field = CUSTOMER_LIST_FIELDS[column.fieldId];
  const label = field.label;
  const sortKey = field.key as ListSortKey;
  const sortable =
    field.sortable &&
    (customerHealthListConfig.sort.allowed as readonly string[]).includes(
      field.key,
    );

  return {
    id: column.columnId,
    header: sortable
      ? sortableHeader({
          label,
          sortKey,
          sorts: options.sorts,
          onSortToggle: options.onSortToggle,
          isPending: options.isPending,
        })
      : label,
    ariaSort: sortable
      ? listSortAriaForColumn(options.sorts, sortKey)
      : undefined,
    cell: (row) => formatCell(column.format, row, field.path),
    className: column.className,
    headerClassName: column.headerClassName ?? column.className,
  };
}

/**
 * Build list columns from {@link customerHealthListConfig.columns}.
 * Non-sortable catalog fields (e.g. segment) render a plain header.
 */
export function buildCustomerTableColumns({
  sorts,
  onSortToggle,
  isPending = false,
}: BuildCustomerTableColumnsOptions): TableColumnDef<CustomerListRow>[] {
  return customerHealthListConfig.columns.map((column) =>
    buildColumn(column, { sorts, onSortToggle, isPending }),
  );
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
