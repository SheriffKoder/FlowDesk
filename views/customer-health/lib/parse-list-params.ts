/**
 * @file views/customer-health/lib/parse-list-params.ts
 *
 * Purpose: Coerce raw URL / Next.js `searchParams` into typed list state.
 * Used in: `app/customers/health/page.tsx` (server), drawer hydrate path, unit tests.
 * Used for: Safe defaults and invalid-value fallbacks so shareable links never crash
 *   the list (ADR-002 / routing contract).
 *
 * Function Index:
 * - firstValue — read a single string from URLSearchParams or a record
 * - parseSegment / parsePage / parsePageSize / parseSort / parseOrder / parseCustomerId
 * - parseListParams(raw) → CustomerHealthUrlParams
 *
 * @example
 * parseListParams(new URLSearchParams("segment=at_risk&page=2"))
 * // → { search: "", segment: "at_risk", page: 2, pageSize: 20, sort: null, ... }
 *
 * Steps:
 * 1. Read each known key via firstValue (supports arrays from Next searchParams).
 * 2. Coerce each field with a dedicated parser (invalid → default / null).
 * 3. Drop orphan `order` when sort is missing; assemble CustomerHealthUrlParams.
 */

import {
  CUSTOMER_SEGMENTS,
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_PAGE,
  LIST_PAGE_SIZES,
  LIST_SORT_KEYS,
  LIST_SORT_ORDERS,
  LIST_URL_PARAM_KEYS,
  type CustomerHealthUrlParams,
  type CustomerSegment,
  type ListPageSize,
  type ListSortKey,
  type ListSortOrder,
} from "../model/list-url-params";

/////////////////////////////////////////////////////////////
// Input shapes — Next.js may hand a plain record or URLSearchParams.
/////////////////////////////////////////////////////////////

/**
 * Next.js App Router `searchParams` bag or a browser `URLSearchParams`.
 * Arrays appear when the same key is repeated; we always take the first value.
 */
export type RawSearchParams =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

/////////////////////////////////////////////////////////////
// Field readers — one responsibility each; invalid → safe fallback.
/////////////////////////////////////////////////////////////

/**
 * Read the first string value for a query key.
 *
 * @param raw - URLSearchParams or Next.js searchParams record
 * @param key - Canonical param name from LIST_URL_PARAM_KEYS
 * @returns First value, or undefined when the key is absent
 */
function firstValue(
  raw: RawSearchParams,
  key: string,
): string | undefined {
  // URLSearchParams path (tests + serialize round-trips).
  if (raw instanceof URLSearchParams) {
    const value = raw.get(key);
    return value === null ? undefined : value;
  }

  // Next.js record path — take index 0 when the framework passes string[].
  const value = raw[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Parse segment filter; unknown values become “all” (null).
 *
 * @param value - Raw `segment` query value
 * @returns Known CustomerSegment or null
 */
function parseSegment(value: string | undefined): CustomerSegment | null {
  if (value === undefined || value === "") {
    return null;
  }
  return (CUSTOMER_SEGMENTS as readonly string[]).includes(value)
    ? (value as CustomerSegment)
    : null;
}

/**
 * Parse 1-based page; non-numeric or &lt; 1 → default page.
 *
 * @param value - Raw `page` query value
 * @returns Safe page index (≥ 1)
 */
function parsePage(value: string | undefined): number {
  if (value === undefined || value === "") {
    return DEFAULT_LIST_PAGE;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < DEFAULT_LIST_PAGE) {
    return DEFAULT_LIST_PAGE;
  }
  return parsed;
}

/**
 * Parse page size against the allow-list; anything else → default size.
 *
 * @param value - Raw `page_size` query value
 * @returns Allowed ListPageSize
 */
function parsePageSize(value: string | undefined): ListPageSize {
  if (value === undefined || value === "") {
    return DEFAULT_CUSTOMER_HEALTH_URL_PARAMS.pageSize;
  }
  const parsed = Number.parseInt(value, 10);
  if ((LIST_PAGE_SIZES as readonly number[]).includes(parsed)) {
    return parsed as ListPageSize;
  }
  return DEFAULT_CUSTOMER_HEALTH_URL_PARAMS.pageSize;
}

/**
 * Parse sort column key; unknown / empty → null (use resolveListSort later).
 *
 * @param value - Raw `sort` query value
 * @returns Known ListSortKey or null
 */
function parseSort(value: string | undefined): ListSortKey | null {
  if (value === undefined || value === "") {
    return null;
  }
  return (LIST_SORT_KEYS as readonly string[]).includes(value)
    ? (value as ListSortKey)
    : null;
}

/**
 * Parse sort direction; unknown / empty → null.
 *
 * @param value - Raw `order` query value
 * @returns `asc` | `desc` or null
 */
function parseOrder(value: string | undefined): ListSortOrder | null {
  if (value === undefined || value === "") {
    return null;
  }
  return (LIST_SORT_ORDERS as readonly string[]).includes(value)
    ? (value as ListSortOrder)
    : null;
}

/**
 * Parse drawer customer id; blank / whitespace → null (drawer closed).
 *
 * @param value - Raw `customerId` query value
 * @returns Trimmed id or null
 */
function parseCustomerId(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/////////////////////////////////////////////////////////////
// Public entry — assemble the full typed contract object.
/////////////////////////////////////////////////////////////

/**
 * Coerce raw URL / route `searchParams` into safe Customer Health list state.
 *
 * Invalid values fall back to defaults. Absent or invalid `sort` stays null so
 * serialize omits it and `resolveListSort` applies health-then-name for queries.
 *
 * @param raw - Next.js searchParams object or URLSearchParams
 * @returns Typed list + drawer URL state (never throws)
 *
 * @example
 * ```ts
 * parseListParams({ segment: "nope", page: "0" })
 * // → DEFAULT_CUSTOMER_HEALTH_URL_PARAMS
 * ```
 */
export function parseListParams(raw: RawSearchParams): CustomerHealthUrlParams {
  //////////////////////////////////
  // 1. Read sort/order first so we can drop orphan order without a valid sort.
  const sort = parseSort(firstValue(raw, LIST_URL_PARAM_KEYS.sort));
  let order = parseOrder(firstValue(raw, LIST_URL_PARAM_KEYS.order));

  // Order without a valid sort is meaningless — drop it.
  if (sort === null) {
    order = null;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Coerce remaining fields independently; each parser owns its fallback.
  return {
    search: (firstValue(raw, LIST_URL_PARAM_KEYS.search) ?? "").trim(),
    segment: parseSegment(firstValue(raw, LIST_URL_PARAM_KEYS.segment)),
    page: parsePage(firstValue(raw, LIST_URL_PARAM_KEYS.page)),
    pageSize: parsePageSize(firstValue(raw, LIST_URL_PARAM_KEYS.pageSize)),
    sort,
    order,
    customerId: parseCustomerId(
      firstValue(raw, LIST_URL_PARAM_KEYS.customerId),
    ),
  };
  //////////////////////////////////
}
