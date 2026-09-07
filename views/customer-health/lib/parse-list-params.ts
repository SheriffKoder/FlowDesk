/**
 * @file views/customer-health/lib/parse-list-params.ts
 *
 * Purpose: Coerce raw URL / Next.js `searchParams` into typed list state.
 * Used in: `app/customers/health/page.tsx` (server), drawer hydrate path, unit tests.
 * Used for: Safe defaults and invalid-value fallbacks so shareable links never crash
 *   the list (ADR-002 / routing contract).
 *
 * Function Index:
 * - firstValue / allValues — read query keys from URLSearchParams or a record
 * - parseSegments / parsePage / parsePageSize / parseSort / parseOrder / parseCustomerId
 * - parseListParams(raw) → CustomerHealthUrlParams
 *
 * @example
 * parseListParams(new URLSearchParams("segment=at_risk,watch&page=2"))
 * // → { search: "", segment: ["watch", "at_risk"], page: 2, ... } (canonical order)
 *
 * Steps:
 * 1. Read each known key (segment collects all tokens / comma lists).
 * 2. Coerce each field with a dedicated parser (invalid → default / empty).
 * 3. Drop orphan `order` when sort is missing; assemble CustomerHealthUrlParams.
 */

import {
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_PAGE,
  LIST_PAGE_SIZES,
  LIST_SORT_KEYS,
  LIST_SORT_ORDERS,
  LIST_URL_PARAM_KEYS,
  canonicalizeSegments,
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
 * Arrays appear when the same key is repeated.
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
  if (raw instanceof URLSearchParams) {
    const value = raw.get(key);
    return value === null ? undefined : value;
  }

  const value = raw[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Read all string values for a query key (repeated keys + record arrays).
 */
function allValues(raw: RawSearchParams, key: string): string[] {
  if (raw instanceof URLSearchParams) {
    return raw.getAll(key);
  }

  const value = raw[key];
  if (value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

/**
 * Parse multi-select segment filter.
 * Accepts `segment=watch`, `segment=watch,healthy`, and repeated keys.
 * Unknown tokens dropped; empty → all segments.
 */
function parseSegments(raw: RawSearchParams): CustomerSegment[] {
  const tokens = allValues(raw, LIST_URL_PARAM_KEYS.segment).flatMap((entry) =>
    entry
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0),
  );

  return canonicalizeSegments(tokens);
}

/**
 * Parse 1-based page; non-numeric or &lt; 1 → default page.
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
 */
export function parseListParams(raw: RawSearchParams): CustomerHealthUrlParams {
  //////////////////////////////////
  // 1. Read sort/order first so we can drop orphan order without a valid sort.
  const sort = parseSort(firstValue(raw, LIST_URL_PARAM_KEYS.sort));
  let order = parseOrder(firstValue(raw, LIST_URL_PARAM_KEYS.order));

  if (sort === null) {
    order = null;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Coerce remaining fields independently; each parser owns its fallback.
  return {
    search: (firstValue(raw, LIST_URL_PARAM_KEYS.search) ?? "").trim(),
    segment: parseSegments(raw),
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
