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
 * - canonicalizeSegments / segmentsEqual / sortsEqual / canonicalizeSorts
 * - CustomerHealthUrlParams / ResolvedListSort — parsed + query-ready shapes
 *
 * Steps:
 * 1. Lock query key strings in LIST_URL_PARAM_KEYS.
 * 2. Lock allow-lists (segment, sort keys, page sizes) and defaults.
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
  /** Multi-level sorts: `sort=mrr:asc,owner:desc` (url-kit dialect). */
  sort: "sort",
  customerId: "customerId",
} as const;

export type ListUrlParamKey =
  (typeof LIST_URL_PARAM_KEYS)[keyof typeof LIST_URL_PARAM_KEYS];

/////////////////////////////////////////////////////////////
// Allow-lists — invalid URL values coerce to defaults / null in parse.
/////////////////////////////////////////////////////////////

/**
 * Sortable column keys written inside the URL `sort` param.
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

/** One level in a multi-level URL sort (`field:order`). */
export type ListSortSpec = {
  field: ListSortKey;
  order: ListSortOrder;
};

/** Allowed page sizes for the shared pagination control. */
export const LIST_PAGE_SIZES = [10, 20, 50] as const;

export type ListPageSize = (typeof LIST_PAGE_SIZES)[number];

/////////////////////////////////////////////////////////////
// Defaults — first land omits sort/page/size from the URL when possible.
/////////////////////////////////////////////////////////////

export const DEFAULT_LIST_PAGE = 1;
export const DEFAULT_LIST_PAGE_SIZE: ListPageSize = 20;

/**
 * Default list order when `sort` is absent from the URL.
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
  keys: ListSortSpec[];
};

export type ResolvedListSort = DefaultListSort | ExplicitListSort;

/**
 * Parsed Customer Health URL state.
 * `sorts` stays empty when absent or invalid so serialize omits `sort`;
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
  /**
   * Multi-level sorts in priority order (primary first).
   * Empty = triage default (health-then-name). Serialized as `field:order,...`.
   */
  sorts: ListSortSpec[];
  /** Drawer open target; `null` when closed. */
  customerId: string | null;
};

export const DEFAULT_CUSTOMER_HEALTH_URL_PARAMS: CustomerHealthUrlParams = {
  search: "",
  segment: [],
  page: DEFAULT_LIST_PAGE,
  pageSize: DEFAULT_LIST_PAGE_SIZE,
  sorts: [],
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
  "sorts",
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

/**
 * Drop unknown keys / invalid orders; keep first occurrence of each field
 * (priority order preserved).
 */
export function canonicalizeSorts(
  sorts: readonly ListSortSpec[],
): ListSortSpec[] {
  const seen = new Set<ListSortKey>();
  const next: ListSortSpec[] = [];

  for (const spec of sorts) {
    if (!(LIST_SORT_KEYS as readonly string[]).includes(spec.field)) {
      continue;
    }
    if (!(LIST_SORT_ORDERS as readonly string[]).includes(spec.order)) {
      continue;
    }
    if (seen.has(spec.field)) {
      continue;
    }
    seen.add(spec.field);
    next.push({ field: spec.field, order: spec.order });
  }

  return next;
}

/**
 * Compare two multi-level sort lists (order-sensitive).
 */
export function sortsEqual(
  a: readonly ListSortSpec[],
  b: readonly ListSortSpec[],
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every(
    (spec, index) =>
      spec.field === b[index]?.field && spec.order === b[index]?.order,
  );
}
