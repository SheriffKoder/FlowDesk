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
 * - parseSegments / parsePage / parsePageSize / parseSorts / parseCustomerId
 * - parseListParams(raw) → CustomerHealthUrlParams
 *
 * @example
 * parseListParams(new URLSearchParams("segment=at_risk,watch&sort=mrr:desc,name:asc"))
 * // → { segment: ["watch", "at_risk"], sorts: [{ field: "mrr", order: "desc" }, ...] }
 *
 * Steps:
 * 1. Read each known key (segment collects all tokens / comma lists).
 * 2. Coerce each field with a dedicated parser (invalid → default / empty).
 * 3. Assemble CustomerHealthUrlParams (multi-level `sort` dialect).
 */

import {
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_PAGE,
  LIST_PAGE_SIZES,
  LIST_SORT_KEYS,
  LIST_URL_PARAM_KEYS,
  canonicalizeSegments,
  canonicalizeSorts,
  type CustomerHealthUrlParams,
  type CustomerSegment,
  type ListPageSize,
  type ListSortKey,
  type ListSortOrder,
  type ListSortSpec,
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
 * Parse multi-level `sort=field:order,field:order`.
 * Also accepts legacy `sort=field` + `order=asc|desc` for one-level links.
 * Unknown keys / empty → [].
 */
function parseSorts(raw: RawSearchParams): ListSortSpec[] {
  const sortValue = firstValue(raw, LIST_URL_PARAM_KEYS.sort);
  if (sortValue === undefined || sortValue.trim() === "") {
    return [];
  }

  const trimmed = sortValue.trim();

  //////////////////////////////////
  // Legacy single-column: `sort=mrr` (+ optional `order`) without `:`.
  if (!trimmed.includes(":") && !trimmed.includes(",")) {
    if (!(LIST_SORT_KEYS as readonly string[]).includes(trimmed)) {
      return [];
    }
    const legacyOrder = firstValue(raw, "order");
    const order: ListSortOrder =
      legacyOrder === "desc" ? "desc" : "asc";
    return canonicalizeSorts([
      { field: trimmed as ListSortKey, order },
    ]);
  }
  //////////////////////////////////

  //////////////////////////////////
  // url-kit dialect: `mrr:desc,name:asc`
  const specs: ListSortSpec[] = trimmed.split(",").flatMap((token) => {
    const part = token.trim();
    if (part.length === 0) {
      return [];
    }
    const [rawField, rawOrder] = part.split(":");
    const field = (rawField ?? "").trim();
    const orderToken = (rawOrder ?? "asc").trim();
    if (!(LIST_SORT_KEYS as readonly string[]).includes(field)) {
      return [];
    }
    const order: ListSortOrder =
      orderToken === "desc" ? "desc" : "asc";
    return [{ field: field as ListSortKey, order }];
  });

  return canonicalizeSorts(specs);
  //////////////////////////////////
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
 * Invalid values fall back to defaults. Absent or invalid `sort` stays empty so
 * serialize omits it and `resolveListSort` applies health-then-name for queries.
 *
 * @param raw - Next.js searchParams object or URLSearchParams
 * @returns Typed list + drawer URL state (never throws)
 */
export function parseListParams(raw: RawSearchParams): CustomerHealthUrlParams {
  return {
    search: (firstValue(raw, LIST_URL_PARAM_KEYS.search) ?? "").trim(),
    segment: parseSegments(raw),
    page: parsePage(firstValue(raw, LIST_URL_PARAM_KEYS.page)),
    pageSize: parsePageSize(firstValue(raw, LIST_URL_PARAM_KEYS.pageSize)),
    sorts: parseSorts(raw),
    customerId: parseCustomerId(
      firstValue(raw, LIST_URL_PARAM_KEYS.customerId),
    ),
  };
}
