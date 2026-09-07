/**
 * @file tests/unit/list-url-params.test.ts
 *
 * Purpose: Unit coverage for Customer Health URL contract helpers.
 * Used in: Vitest suite (`npm test`); run whenever parse/serialize/page rules change.
 * Used for: Lock ADR-002 behaviors — safe fallbacks, clean first-land URLs,
 *   health-then-name default sort, page reset, and page clamp.
 *
 * Function Index:
 * - params(patch?) — build CustomerHealthUrlParams from defaults + overrides
 *
 * Suites:
 * 1. parseListParams — empty / valid / invalid / trim / orphan order / arrays
 * 2. serializeListParams — omit defaults, round-trip, pair order, no default sort
 * 3. resolveListSort — default vs explicit
 * 4. applyListParamsPatch — reset page vs keep page
 * 5. clampPage — shrink / empty / in-range
 *
 * Steps (plan-clean Step 2 Testing):
 * 1. Assert parse/serialize defaults including health-then-name resolution.
 * 2. Assert reset page → 1 when search/segment/sort/page_size change.
 * 3. Assert invalid param fallbacks and page clamp.
 */

import { describe, expect, it } from "vitest";

import {
  applyListParamsPatch,
  clampPage,
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_SORT,
  parseListParams,
  resolveListSort,
  serializeListParamsToString,
  type CustomerHealthUrlParams,
} from "@/views/customer-health";

/////////////////////////////////////////////////////////////
// Test helpers
/////////////////////////////////////////////////////////////

/**
 * Build typed URL params from defaults plus a partial override.
 *
 * @param patch - Fields to override on DEFAULT_CUSTOMER_HEALTH_URL_PARAMS
 * @returns Full CustomerHealthUrlParams for assertions and serialize inputs
 */
function params(
  patch: Partial<CustomerHealthUrlParams> = {},
): CustomerHealthUrlParams {
  return { ...DEFAULT_CUSTOMER_HEALTH_URL_PARAMS, ...patch };
}

/////////////////////////////////////////////////////////////
// parseListParams — URL / searchParams → typed state
/////////////////////////////////////////////////////////////

describe("parseListParams", () => {
  it("returns defaults for an empty query", () => {
    // First land and empty bag must match the locked default object.
    expect(parseListParams({})).toEqual(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS);
    expect(parseListParams(new URLSearchParams())).toEqual(
      DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
    );
  });

  it("parses a full valid query", () => {
    // Happy path: every list + drawer key maps to the typed shape.
    const raw = new URLSearchParams({
      search: "acme",
      segment: "at_risk",
      page: "3",
      page_size: "10",
      sort: "mrr",
      order: "desc",
      customerId: "cust_1",
    });

    expect(parseListParams(raw)).toEqual({
      search: "acme",
      segment: ["at_risk"],
      page: 3,
      pageSize: 10,
      sort: "mrr",
      order: "desc",
      customerId: "cust_1",
    });
  });

  it("falls back safely on invalid values", () => {
    // Bad enums / sizes / ids must not throw; coerce to defaults.
    expect(
      parseListParams({
        segment: "nope",
        page: "0",
        page_size: "99",
        sort: "unknown",
        order: "sideways",
        customerId: "  ",
      }),
    ).toEqual(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS);
  });

  it("trims search and customerId", () => {
    // Share links with padding should still hydrate clean values.
    expect(
      parseListParams({ search: "  acme  ", customerId: "  id-2  " }),
    ).toEqual(
      params({
        search: "acme",
        customerId: "id-2",
      }),
    );
  });

  it("drops order when sort is missing or invalid", () => {
    // Orphan order must not survive; resolveListSort owns default direction.
    expect(parseListParams({ order: "desc" }).order).toBeNull();
    expect(parseListParams({ sort: "nope", order: "desc" }).order).toBeNull();
  });

  it("parses multi-select segments from comma lists and arrays", () => {
    // Comma-joined share links and Next.js string[] both become a canonical list.
    expect(
      parseListParams({ segment: "at_risk,watch,nope" }),
    ).toEqual(params({ segment: ["watch", "at_risk"] }));

    expect(
      parseListParams({ segment: ["watch", "healthy"], page: ["2"] }),
    ).toEqual(params({ segment: ["healthy", "watch"], page: 2 }));
  });
});

/////////////////////////////////////////////////////////////
// serializeListParams — typed state → stable query string
/////////////////////////////////////////////////////////////

describe("serializeListParams", () => {
  it("omits defaults so first land stays clean", () => {
    // Empty string = no query noise on triage-first land.
    expect(serializeListParamsToString(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS)).toBe(
      "",
    );
  });

  it("round-trips non-default values", () => {
    // serialize → parse must restore the same typed object.
    const input = params({
      search: "beta",
      segment: ["watch", "at_risk"],
      page: 4,
      pageSize: 50,
      sort: "name",
      order: "asc",
      customerId: "c9",
    });

    const query = serializeListParamsToString(input);
    expect(query).toContain("segment=watch%2Cat_risk");
    expect(parseListParams(new URLSearchParams(query))).toEqual(input);
  });

  it("pairs order=asc when sort is set without order", () => {
    // Explicit sort always ships with a direction for stable share links.
    const query = serializeListParamsToString(
      params({ sort: "health", order: null }),
    );
    expect(query).toContain("sort=health");
    expect(query).toContain("order=asc");
  });

  it("does not write default sort into the URL", () => {
    // Health-then-name is query-only; never canonicalize into first-land URL.
    const query = serializeListParamsToString(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS);
    expect(query).not.toContain("sort=");
    expect(query).not.toContain("order=");
  });
});

/////////////////////////////////////////////////////////////
// resolveListSort — absent URL sort → triage default for the query
/////////////////////////////////////////////////////////////

describe("resolveListSort", () => {
  it("uses health-then-name when sort is absent", () => {
    // Locked default: health asc (risk-first), then name asc.
    expect(resolveListSort({ sort: null, order: null })).toEqual(
      DEFAULT_LIST_SORT,
    );
  });

  it("keeps an explicit sort and defaults missing order to asc", () => {
    // Explicit column wins; missing order becomes asc (not the multi-key default).
    expect(resolveListSort({ sort: "mrr", order: null })).toEqual({
      kind: "explicit",
      field: "mrr",
      order: "asc",
    });
    expect(resolveListSort({ sort: "owner", order: "desc" })).toEqual({
      kind: "explicit",
      field: "owner",
      order: "desc",
    });
  });
});

/////////////////////////////////////////////////////////////
// applyListParamsPatch — filter/sort/size change resets page → 1
/////////////////////////////////////////////////////////////

describe("applyListParamsPatch", () => {
  it("resets page to 1 when search, segment, sort, or pageSize change", () => {
    // Staying on page 5 after narrowing filters would show an empty window.
    const current = params({ page: 5, search: "a", segment: ["healthy"] });

    expect(applyListParamsPatch(current, { search: "b" }).page).toBe(1);
    expect(
      applyListParamsPatch(current, { segment: ["watch"] }).page,
    ).toBe(1);
    expect(applyListParamsPatch(current, { sort: "name", order: "asc" }).page).toBe(
      1,
    );
    expect(applyListParamsPatch(current, { pageSize: 50 }).page).toBe(1);
    // Same segment contents (new array) must not reset page.
    expect(
      applyListParamsPatch(current, { segment: ["healthy"] }).page,
    ).toBe(5);
  });

  it("keeps page when only page or customerId changes", () => {
    // Pagination and drawer open must not wipe the current page index.
    const current = params({ page: 5 });

    expect(applyListParamsPatch(current, { page: 3 }).page).toBe(3);
    expect(
      applyListParamsPatch(current, { customerId: "x" }),
    ).toEqual(params({ page: 5, customerId: "x" }));
  });
});

/////////////////////////////////////////////////////////////
// clampPage — keep page inside the real result window
/////////////////////////////////////////////////////////////

describe("clampPage", () => {
  it("clamps past the last page when the result set shrinks", () => {
    // 25 rows @ 10 → 3 pages; page 5 must become 3.
    expect(clampPage(5, 25, 10)).toBe(3);
    expect(clampPage(9, 20, 20)).toBe(1);
  });

  it("returns page 1 for empty or invalid totals", () => {
    // Empty list and negative page still land on a safe first page.
    expect(clampPage(3, 0, 20)).toBe(1);
    expect(clampPage(-2, 40, 20)).toBe(1);
  });

  it("leaves an in-range page unchanged", () => {
    expect(clampPage(2, 40, 20)).toBe(2);
  });
});
