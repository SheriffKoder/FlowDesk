/**
 * @file views/customer-health/model/list-url-params.ts
 *
 * Purpose: Single source of truth for Customer Health URL param names, types,
 *   enums, and defaults (list + drawer).
 * Used in: `views/customer-health/lib/*`, view public exports, unit tests.
 * Used for: Document the canonical query contract so parse/serialize and the
 *   API share one vocabulary (`docs/architecture/routing.md`, ADR-002).
 *
 * Function Index (constants / types):
 * - LIST_URL_PARAM_KEYS — query string key names
 * - CUSTOMER_SEGMENTS / LIST_SORT_KEYS / LIST_SORT_ORDERS / LIST_PAGE_SIZES
 * - DEFAULT_LIST_* / DEFAULT_LIST_SORT / DEFAULT_CUSTOMER_HEALTH_URL_PARAMS
 * - PAGE_RESET_FIELDS — fields that force page → 1
 * - canonicalizeSegments / segmentsEqual
 * - CustomerHealthUrlParams / ResolvedListSort — parsed + query-ready shapes
 *
 * Steps:
 * 1. Lock query key strings in LIST_URL_PARAM_KEYS.
 * 2. Lock allow-lists (segment, sort, order, page sizes) and defaults.
 * 3. Export typed URL state + default sort plan for resolveListSort.
 */

import {
  CUSTOMER_SEGMENTS,
  type CustomerSegment,
} from "@/entities/customer";

export { CUSTOMER_SEGMENTS, type CustomerSegment };

/////////////////////////////////////////////////////////////
// Query key names — never hard-code these strings outside this file.
/////////////////////////////////////////////////////////////

/** Query string keys (single source of truth for names). */
export const LIST_URL_PARAM_KEYS = {
  search: "search",
  segment: "segment",
  page: "page",
  pageSize: "page_size",
  sort: "sort",
  order: "order",
  customerId: "customerId",
} as const;

export type ListUrlParamKey =
  (typeof LIST_URL_PARAM_KEYS)[keyof typeof LIST_URL_PARAM_KEYS];

/////////////////////////////////////////////////////////////
// Allow-lists — invalid URL values coerce to defaults / null in parse.
/////////////////////////////////////////////////////////////

/**
 * Sortable column keys written to the URL `sort` param.
 * `last_active` maps to the table column id `lastActive`.
 */
export const LIST_SORT_KEYS = [
  "name",
  "mrr",
  "last_active",
  "health",
  "owner",
] as const;

export type ListSortKey = (typeof LIST_SORT_KEYS)[number];

export const LIST_SORT_ORDERS = ["asc", "desc"] as const;

export type ListSortOrder = (typeof LIST_SORT_ORDERS)[number];

/** Allowed page sizes for the shared pagination control. */
export const LIST_PAGE_SIZES = [10, 20, 50] as const;

export type ListPageSize = (typeof LIST_PAGE_SIZES)[number];

/////////////////////////////////////////////////////////////
// Defaults — first land omits sort/page/size from the URL when possible.
/////////////////////////////////////////////////////////////

export const DEFAULT_LIST_PAGE = 1;
export const DEFAULT_LIST_PAGE_SIZE: ListPageSize = 20;

/**
 * Default list order when `sort` / `order` are absent from the URL.
 * Health ascending = risk-first (lower score first); name A→Z breaks ties.
 * Do not canonicalize these into the URL on first land.
 */
export const DEFAULT_LIST_SORT = {
  kind: "default",
  keys: [
    { field: "health" as const, order: "asc" as const },
    { field: "name" as const, order: "asc" as const },
  ],
} as const;

export type DefaultListSort = typeof DEFAULT_LIST_SORT;

export type ExplicitListSort = {
  kind: "explicit";
  field: ListSortKey;
  order: ListSortOrder;
};

export type ResolvedListSort = DefaultListSort | ExplicitListSort;

/**
 * Parsed Customer Health URL state.
 * `sort` / `order` stay null when absent or invalid so serialize omits them;
 * use `resolveListSort` for the list query.
 */
export type CustomerHealthUrlParams = {
  search: string;
  /**
   * Multi-select segment filter (OR).
   * Empty array = all segments (no filter). Serialized as comma-joined `segment`.
   */
  segment: CustomerSegment[];
  page: number;
  pageSize: ListPageSize;
  sort: ListSortKey | null;
  order: ListSortOrder | null;
  /** Drawer open target; `null` when closed. */
  customerId: string | null;
};

export const DEFAULT_CUSTOMER_HEALTH_URL_PARAMS: CustomerHealthUrlParams = {
  search: "",
  segment: [],
  page: DEFAULT_LIST_PAGE,
  pageSize: DEFAULT_LIST_PAGE_SIZE,
  sort: null,
  order: null,
  customerId: null,
};

/////////////////////////////////////////////////////////////
// Page-reset contract — used by applyListParamsPatch.
/////////////////////////////////////////////////////////////

/** Fields that force `page` back to 1 when they change. */
export const PAGE_RESET_FIELDS = [
  "search",
  "segment",
  "pageSize",
  "sort",
  "order",
] as const satisfies ReadonlyArray<keyof CustomerHealthUrlParams>;

export type PageResetField = (typeof PAGE_RESET_FIELDS)[number];

/**
 * Stable segment order matching {@link CUSTOMER_SEGMENTS}; drops unknowns.
 */
export function canonicalizeSegments(
  segments: readonly string[],
): CustomerSegment[] {
  const selected = new Set(segments);
  return CUSTOMER_SEGMENTS.filter((segment) => selected.has(segment));
}

/**
 * Compare two segment selections (order-sensitive after canonicalize).
 */
export function segmentsEqual(
  a: readonly CustomerSegment[],
  b: readonly CustomerSegment[],
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((segment, index) => segment === b[index]);
}
