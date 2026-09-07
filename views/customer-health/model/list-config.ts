/**
 * @file views/customer-health/model/list-config.ts
 *
 * Purpose: Customer Health page composition config — which catalog fields,
 *   filters, pagination, and URL dialect this list uses.
 * Used in: `list-url-params`, `customer-table-columns`, toolbar / shell.
 * Used for: Copy the view, swap this file + API loader, keep shared UI dumb.
 *
 * Owns: page product surface (columns, URL keys, page sizes, defaults).
 * Does not own: field semantics (see `entities/customer` field catalog).
 *
 * See: `docs/architecture/list-field-catalog.md`
 */

import {
  CUSTOMER_LIST_FIELDS,
  CUSTOMER_LIST_SEGMENT_FILTER_OPTIONS,
  CUSTOMER_LIST_SORT_FIELDS,
  DEFAULT_CUSTOMER_LIST_SORT_KEYS,
} from "@/entities/customer";

/////////////////////////////////////////////////////////////
// Cell format ids — view registry in customer-table-columns
/////////////////////////////////////////////////////////////

export type CustomerHealthCellFormat =
  | "text"
  | "currencyUsd"
  | "shortDate"
  | "number"
  | "segmentLabel";

export type CustomerHealthColumnConfig = {
  /** Catalog field id (`name`, `last_active`, …). */
  fieldId: keyof typeof CUSTOMER_LIST_FIELDS;
  /** Table column id (camelCase for DOM / React keys). */
  columnId: string;
  format: CustomerHealthCellFormat;
  className?: string;
};

/////////////////////////////////////////////////////////////
// Page config
/////////////////////////////////////////////////////////////

/**
 * Single composition config for Customer Health list controls + table.
 * Change this (and the server loader / API) to clone the page for another list.
 */
export const customerHealthListConfig = {
  /**
   * Query string key names for this page’s URL dialect.
   * Never hard-code these strings outside consumers of this config.
   */
  params: {
    search: "search",
    segment: "segment",
    page: "page",
    pageSize: "page_size",
    /** Multi-level sorts: `sort=mrr:asc,owner:desc` (url-kit dialect). */
    sort: "sort",
    customerId: "customerId",
  },

  search: {
    enabled: true as const,
    /** Placeholder copy — matches catalog searchable fields (name + domain). */
    placeholder: "Search by name or domain",
  },

  filters: [
    {
      id: "segment" as const,
      fieldId: "segment" as const,
      param: "segment" as const,
      type: "multi" as const,
      label: "Segment",
      options: CUSTOMER_LIST_SEGMENT_FILTER_OPTIONS,
      resetsPage: true as const,
    },
  ],

  pagination: {
    sizes: [10, 20, 50] as const,
    defaultSize: 20 as const,
    defaultPage: 1 as const,
    /** URL state keys that force `page` → 1 when they change. */
    resetsPageOn: ["search", "segment", "pageSize", "sorts"] as const,
  },

  sort: {
    /**
     * Allowed explicit sort keys for this page.
     * Must be a subset of entity {@link CUSTOMER_LIST_SORT_FIELDS}.
     */
    allowed: CUSTOMER_LIST_SORT_FIELDS,
    orders: ["asc", "desc"] as const,
    /**
     * Triage default when URL omits `sort` — mirrors entity catalog.
     * Not written to the URL on first land.
     */
    defaultKeys: DEFAULT_CUSTOMER_LIST_SORT_KEYS,
  },

  columns: [
    {
      fieldId: "name",
      columnId: "name",
      format: "text",
      className: "max-w-[14rem] truncate",
    },
    {
      fieldId: "mrr",
      columnId: "mrr",
      format: "currencyUsd",
      className: "tabular-nums",
    },
    {
      fieldId: "last_active",
      columnId: "lastActive",
      format: "shortDate",
      className: "text-muted-foreground",
    },
    {
      fieldId: "health",
      columnId: "health",
      format: "number",
      className: "font-medium tabular-nums",
    },
    {
      fieldId: "owner",
      columnId: "owner",
      format: "text",
    },
    {
      fieldId: "segment",
      columnId: "segment",
      format: "segmentLabel",
    },
  ] as const satisfies ReadonlyArray<CustomerHealthColumnConfig>,
} as const;

export type CustomerHealthListConfig = typeof customerHealthListConfig;
