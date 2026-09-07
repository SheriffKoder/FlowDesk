/**
 * @file tests/unit/list-url-params.test.ts
 *
 * Purpose: Unit coverage for Customer Health URL contract helpers.
 * Used in: Vitest suite (`npm test`); run whenever parse/serialize/page rules change.
 * Used for: Lock ADR-002 behaviors — safe fallbacks, clean first-land URLs,
 *   health-then-name default sort, multi-level append sorts, page reset/clamp.
 *
 * Function Index:
 * - params(patch?) — build CustomerHealthUrlParams from defaults + overrides
 *
 * Suites:
 * 1. parseListParams — empty / valid / invalid / trim / multi-sort / legacy
 * 2. serializeListParams — omit defaults, round-trip, multi-level sort string
 * 3. resolveListSort — default vs explicit multi-level
 * 4. applyListParamsPatch — reset page vs keep page
 * 5. clampPage — shrink / empty / in-range
 * 6. nextListSort — header toggle cycle + append levels + aria helpers
 */

import { describe, expect, it } from "vitest";

import {
  applyListParamsPatch,
  clampPage,
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_SORT,
  listSortAriaForColumn,
  listSortDirectionForColumn,
  listSortLevelForColumn,
  nextListSort,
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
    expect(parseListParams({})).toEqual(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS);
    expect(parseListParams(new URLSearchParams())).toEqual(
      DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
    );
  });

  it("parses a full valid query with multi-level sort", () => {
    const raw = new URLSearchParams({
      search: "acme",
      segment: "at_risk",
      page: "3",
      page_size: "10",
      sort: "mrr:desc,name:asc",
      customerId: "cust_1",
    });

    expect(parseListParams(raw)).toEqual({
      search: "acme",
      segment: ["at_risk"],
      page: 3,
      pageSize: 10,
      sorts: [
        { field: "mrr", order: "desc" },
        { field: "name", order: "asc" },
      ],
      customerId: "cust_1",
    });
  });

  it("accepts legacy sort=field&order=dir as a single level", () => {
    // Older single-column links still hydrate into sorts[].
    expect(
      parseListParams({ sort: "mrr", order: "desc" }),
    ).toEqual(
      params({
        sorts: [{ field: "mrr", order: "desc" }],
      }),
    );
  });

  it("falls back safely on invalid values", () => {
    expect(
      parseListParams({
        segment: "nope",
        page: "0",
        page_size: "99",
        sort: "unknown:desc,also:bad",
        customerId: "  ",
      }),
    ).toEqual(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS);
  });

  it("trims search and customerId", () => {
    expect(
      parseListParams({ search: "  acme  ", customerId: "  id-2  " }),
    ).toEqual(
      params({
        search: "acme",
        customerId: "id-2",
      }),
    );
  });

  it("drops orphan legacy order when sort is missing or invalid", () => {
    expect(parseListParams({ order: "desc" }).sorts).toEqual([]);
    expect(parseListParams({ sort: "nope", order: "desc" }).sorts).toEqual([]);
  });

  it("parses multi-select segments from comma lists and arrays", () => {
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
    expect(serializeListParamsToString(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS)).toBe(
      "",
    );
  });

  it("round-trips non-default values including multi-level sort", () => {
    const input = params({
      search: "beta",
      segment: ["watch", "at_risk"],
      page: 4,
      pageSize: 50,
      sorts: [
        { field: "mrr", order: "desc" },
        { field: "name", order: "asc" },
      ],
      customerId: "c9",
    });

    const query = serializeListParamsToString(input);
    expect(query).toContain("segment=watch%2Cat_risk");
    expect(query).toContain("sort=mrr%3Adesc%2Cname%3Aasc");
    expect(parseListParams(new URLSearchParams(query))).toEqual(input);
  });

  it("does not write default sort into the URL", () => {
    const query = serializeListParamsToString(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS);
    expect(query).not.toContain("sort=");
    expect(query).not.toContain("order=");
  });
});

/////////////////////////////////////////////////////////////
// resolveListSort — absent URL sort → triage default for the query
/////////////////////////////////////////////////////////////

describe("resolveListSort", () => {
  it("uses health-then-name when sorts are empty", () => {
    expect(resolveListSort({ sorts: [] })).toEqual(DEFAULT_LIST_SORT);
  });

  it("keeps an explicit multi-level sort plan", () => {
    expect(
      resolveListSort({
        sorts: [
          { field: "mrr", order: "desc" },
          { field: "owner", order: "asc" },
        ],
      }),
    ).toEqual({
      kind: "explicit",
      keys: [
        { field: "mrr", order: "desc" },
        { field: "owner", order: "asc" },
      ],
    });
  });
});

/////////////////////////////////////////////////////////////
// applyListParamsPatch — filter/sort/size change resets page → 1
/////////////////////////////////////////////////////////////

describe("applyListParamsPatch", () => {
  it("resets page to 1 when search, segment, sorts, or pageSize change", () => {
    const current = params({ page: 5, search: "a", segment: ["healthy"] });

    expect(applyListParamsPatch(current, { search: "b" }).page).toBe(1);
    expect(
      applyListParamsPatch(current, { segment: ["watch"] }).page,
    ).toBe(1);
    expect(
      applyListParamsPatch(current, {
        sorts: [{ field: "name", order: "asc" }],
      }).page,
    ).toBe(1);
    expect(applyListParamsPatch(current, { pageSize: 50 }).page).toBe(1);
    expect(
      applyListParamsPatch(current, { segment: ["healthy"] }).page,
    ).toBe(5);
  });

  it("keeps page when only page or customerId changes", () => {
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
    expect(clampPage(5, 25, 10)).toBe(3);
    expect(clampPage(9, 20, 20)).toBe(1);
  });

  it("returns page 1 for empty or invalid totals", () => {
    expect(clampPage(3, 0, 20)).toBe(1);
    expect(clampPage(-2, 40, 20)).toBe(1);
  });

  it("leaves an in-range page unchanged", () => {
    expect(clampPage(2, 40, 20)).toBe(2);
  });
});

/////////////////////////////////////////////////////////////
// nextListSort — header SortButton cycle (multi-level append)
/////////////////////////////////////////////////////////////

describe("nextListSort", () => {
  it("cycles none → asc → desc → remove on the same column", () => {
    expect(nextListSort([], "mrr")).toEqual([
      { field: "mrr", order: "asc" },
    ]);
    expect(
      nextListSort([{ field: "mrr", order: "asc" }], "mrr"),
    ).toEqual([{ field: "mrr", order: "desc" }]);
    expect(
      nextListSort([{ field: "mrr", order: "desc" }], "mrr"),
    ).toEqual([]);
  });

  it("appends a new level when a different column is clicked", () => {
    // url-kit append dialect — do not replace the primary sort.
    expect(
      nextListSort([{ field: "mrr", order: "desc" }], "owner"),
    ).toEqual([
      { field: "mrr", order: "desc" },
      { field: "owner", order: "asc" },
    ]);
  });

  it("flips or removes a secondary level without dropping the primary", () => {
    const twoLevels = [
      { field: "mrr" as const, order: "desc" as const },
      { field: "owner" as const, order: "asc" as const },
    ];
    expect(nextListSort(twoLevels, "owner")).toEqual([
      { field: "mrr", order: "desc" },
      { field: "owner", order: "desc" },
    ]);
    expect(
      nextListSort(
        [
          { field: "mrr", order: "desc" },
          { field: "owner", order: "desc" },
        ],
        "owner",
      ),
    ).toEqual([{ field: "mrr", order: "desc" }]);
  });
});

describe("listSortDirectionForColumn / level / aria", () => {
  it("keeps arrows and aria inactive when URL sorts are empty", () => {
    expect(listSortDirectionForColumn([], "health")).toBeNull();
    expect(listSortAriaForColumn([], "health")).toBe("none");
    expect(listSortLevelForColumn([], "health")).toBeNull();
  });

  it("maps active columns to direction, level, and aria-sort", () => {
    const sorts = [
      { field: "mrr" as const, order: "desc" as const },
      { field: "name" as const, order: "asc" as const },
    ];
    expect(listSortDirectionForColumn(sorts, "mrr")).toBe("desc");
    expect(listSortLevelForColumn(sorts, "mrr")).toBe(0);
    expect(listSortAriaForColumn(sorts, "mrr")).toBe("descending");
    expect(listSortLevelForColumn(sorts, "name")).toBe(1);
    expect(listSortDirectionForColumn(sorts, "owner")).toBeNull();
  });
});
