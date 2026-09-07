/**
 * @file tests/integration/customer-list-page.test.ts
 *
 * Purpose: Integration 3 — searchParams → loadCustomerList → shaped list props.
 * Used in: Vitest; Data & API / Table UI wire (plan-clean Step 5).
 * Used for: Lock server helper mapping without mounting the full page.
 *
 * Function Index:
 * - (none) — exercises `loadCustomerList` directly
 *
 * Suites:
 * 1. Default land — rows + health-then-name + emptyKind null
 * 2. Filters — segment / search narrow rows
 * 3. Pagination — page_size window + clamp
 * 4. Empty kinds — filtered empty (impossible true-empty with current fixtures)
 *
 * Steps (plan-clean Step 5 Testing):
 * 1. Assert default searchParams yield API-shaped rows (risk-first).
 * 2. Assert filter params change the result set.
 * 3. Assert page clamp and emptyKind for no-match filters.
 */

import { describe, expect, it } from "vitest";

import { loadCustomerList } from "@/views/customer-health";

/////////////////////////////////////////////////////////////
// Default land — first paint props
/////////////////////////////////////////////////////////////

describe("loadCustomerList — default land", () => {
  it("returns paginated rows with health-then-name sort", () => {
    // Empty searchParams = first land; fixtures stay behind the entity.
    const list = loadCustomerList({});

    expect(list.page).toBe(1);
    expect(list.pageSize).toBe(20);
    expect(list.total).toBe(22);
    expect(list.rows).toHaveLength(20);
    expect(list.emptyKind).toBeNull();
    expect(list.params.customerId).toBeNull();

    const healthScores = list.rows.map((row) => row.health);
    const sorted = [...healthScores].sort((a, b) => a - b);
    expect(healthScores).toEqual(sorted);
  });
});

/////////////////////////////////////////////////////////////
// Filters — segment + search
/////////////////////////////////////////////////////////////

describe("loadCustomerList — filters", () => {
  it("filters by segment from searchParams", () => {
    const list = loadCustomerList({ segment: "watch" });

    expect(list.total).toBeGreaterThan(0);
    expect(list.rows.every((row) => row.segment === "watch")).toBe(true);
    expect(list.params.segment).toEqual(["watch"]);
    expect(list.emptyKind).toBeNull();
  });

  it("filters by multi-select segments (OR)", () => {
    const list = loadCustomerList({ segment: "watch,at_risk" });

    expect(list.total).toBeGreaterThan(0);
    expect(
      list.rows.every(
        (row) => row.segment === "watch" || row.segment === "at_risk",
      ),
    ).toBe(true);
    expect(list.params.segment).toEqual(["watch", "at_risk"]);
  });

  it("searches by name from searchParams", () => {
    const list = loadCustomerList({ search: "Acme" });

    expect(list.total).toBe(1);
    expect(list.rows[0]?.name).toBe("Acme Robotics");
    expect(list.params.search).toBe("Acme");
  });
});

/////////////////////////////////////////////////////////////
// Pagination — page / page_size + clamp
/////////////////////////////////////////////////////////////

describe("loadCustomerList — pagination", () => {
  it("honors page_size and page", () => {
    const list = loadCustomerList({ page_size: "10", page: "2" });

    expect(list.pageSize).toBe(10);
    expect(list.page).toBe(2);
    expect(list.rows).toHaveLength(10);
  });

  it("clamps page when past the end", () => {
    // 22 rows @ 10 → 3 pages; page 99 must land on 3.
    const list = loadCustomerList({ page: "99", page_size: "10" });

    expect(list.page).toBe(3);
    expect(list.rows.length).toBeGreaterThan(0);
  });
});

/////////////////////////////////////////////////////////////
// Empty kinds — filtered (fixtures always have customers)
/////////////////////////////////////////////////////////////

describe("loadCustomerList — empty kinds", () => {
  it("marks filtered empty when search matches nothing", () => {
    // True empty needs zero fixtures; with seed data only filtered empty is reachable.
    const list = loadCustomerList({ search: "zzz-no-such-customer" });

    expect(list.total).toBe(0);
    expect(list.rows).toHaveLength(0);
    expect(list.emptyKind).toBe("filtered");
  });
});
