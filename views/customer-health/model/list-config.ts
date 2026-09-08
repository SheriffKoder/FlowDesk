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
  type CustomerSegment,
} from "@/entities/customer";
import type { StatusBadgeTone } from "@/shared/ui";
import {
  Activity,
  Building2,
  CircleDollarSign,
  Clock,
  Layers,
  User,
  type LucideIcon,
} from "lucide-react";

/////////////////////////////////////////////////////////////
// Cell format ids — view registry in customer-table-columns
/////////////////////////////////////////////////////////////

export type CustomerHealthCellFormat =
  | "text"
  | "currencyUsd"
  | "shortDate"
  | "number"
  | "segmentLabel"
  | "ownerAvatar";

export type CustomerHealthColumnConfig = {
  /** Catalog field id (`name`, `last_active`, …). */
  fieldId: keyof typeof CUSTOMER_LIST_FIELDS;
  /** Table column id (camelCase for DOM / React keys). */
  columnId: string;
  format: CustomerHealthCellFormat;
  /** Optional Lucide icon rendered before the header label. */
  icon?: LucideIcon;
  /** Applied to `<td>` (and `<th>` when `headerClassName` omitted). */
  className?: string;
  /**
   * Applied to `<th>` only. Prefer width here when cell classes include
   * `truncate` / `max-w-0` so header labels are not clipped.
   */
  headerClassName?: string;
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

  /**
   * Domain segment → shared status badge tone.
   * Keeps entity enums out of `shared/ui/status-badge`.
   */
  segmentBadgeTones: {
    healthy: "success",
    watch: "warning",
    at_risk: "error",
  } as const satisfies Record<CustomerSegment, StatusBadgeTone>,

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
      icon: Building2,
      /** Width only — truncate is on the name span so the Open pill stays visible. */
      className: "w-[28%] min-w-[14rem] max-w-0",
      headerClassName: "w-[28%] min-w-[14rem]",
    },
    {
      fieldId: "mrr",
      columnId: "mrr",
      format: "currencyUsd",
      icon: CircleDollarSign,
      className: "w-[12%] min-w-[7rem] tabular-nums",
      headerClassName: "w-[12%] min-w-[7rem]",
    },
    {
      fieldId: "last_active",
      columnId: "lastActive",
      format: "shortDate",
      icon: Clock,
      className: "w-[16%] min-w-[9rem] text-muted-foreground",
      headerClassName: "w-[16%] min-w-[9rem]",
    },
    {
      fieldId: "health",
      columnId: "health",
      format: "number",
      icon: Activity,
      className: "w-[10%] min-w-[5.5rem] font-medium tabular-nums",
      headerClassName: "w-[10%] min-w-[5.5rem]",
    },
    {
      fieldId: "owner",
      columnId: "owner",
      format: "ownerAvatar",
      icon: User,
      /** Width only — truncate lives on the name span so the avatar stays visible. */
      className: "w-[18%] min-w-[11rem] max-w-0",
      headerClassName: "w-[18%] min-w-[11rem]",
    },
    {
      fieldId: "segment",
      columnId: "segment",
      format: "segmentLabel",
      icon: Layers,
      className: "w-[16%] min-w-[8rem]",
      headerClassName: "w-[16%] min-w-[8rem]",
    },
  ] satisfies ReadonlyArray<CustomerHealthColumnConfig>,
} as const;

export type CustomerHealthListConfig = typeof customerHealthListConfig;
