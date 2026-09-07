/**
 * @file tests/integration/customers-list.api.test.ts
 *
 * Purpose: Integration 1 — GET /api/customers against fixtures.
 * Used in: Vitest; Data & API tickets 5 / 7 gate.
 * Used for: search, segment, page, page_size, sort/order + default sort.
 *
 * Function Index:
 * - getCustomers(query?) — call route GET with an optional query string
 *
 * Suites:
 * 1. Default land — paginated list + health-then-name sort
 * 2. Filters — segment + search (name / domain)
 * 3. Pagination — page / page_size slice + page clamp
 * 4. Explicit sort — sort + order honored
 *
 * Steps (plan-clean Step 3 Testing):
 * 1. Assert default response shape and risk-first ordering.
 * 2. Assert segment and search narrow the result set.
 * 3. Assert pagination and out-of-range page clamp.
 * 4. Assert explicit sort/order overrides the default.
 */

import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/customers/route";
import { customerListResponseSchema } from "@/entities/customer";

/////////////////////////////////////////////////////////////
// Test helpers
/////////////////////////////////////////////////////////////

/**
 * Invoke GET /api/customers with an optional query string.
 *
 * @param query - Raw query without leading `?` (e.g. `segment=watch`)
 * @returns Route Response
 */
async function getCustomers(query = ""): Promise<Response> {
  const url = `http://localhost/api/customers${query ? `?${query}` : ""}`;
  return GET(new Request(url));
}

/////////////////////////////////////////////////////////////
// Default land — shape + health-then-name
/////////////////////////////////////////////////////////////

describe("GET /api/customers — default land", () => {
  it("returns a paginated list with default health-then-name sort", async () => {
    // Empty query: page 1 / size 20 / lowest health first (risk-first triage).
    const response = await getCustomers();
    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = customerListResponseSchema.parse(body);

    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
    expect(parsed.total).toBe(22);
    expect(parsed.data).toHaveLength(20);

    const healthScores = parsed.data.map((row) => row.health);
    const sorted = [...healthScores].sort((a, b) => a - b);
    expect(healthScores).toEqual(sorted);
  });
});

/////////////////////////////////////////////////////////////
// Filters — segment + search
/////////////////////////////////////////////////////////////

describe("GET /api/customers — filters", () => {
  it("filters by segment", async () => {
    // Segment enum must narrow rows; every returned row matches.
    const response = await getCustomers("segment=at_risk");
    const body = customerListResponseSchema.parse(await response.json());

    expect(body.total).toBeGreaterThan(0);
    expect(body.data.every((row) => row.segment === "at_risk")).toBe(true);
  });

  it("filters by multi-select segments (OR)", async () => {
    // Comma-joined segment=watch,at_risk matches either value.
    const response = await getCustomers("segment=watch,at_risk");
    const body = customerListResponseSchema.parse(await response.json());

    expect(body.total).toBeGreaterThan(0);
    expect(
      body.data.every(
        (row) => row.segment === "watch" || row.segment === "at_risk",
      ),
    ).toBe(true);
  });

  it("searches by name or domain", async () => {
    // Search matches name OR domain (case-insensitive contains).
    const byName = customerListResponseSchema.parse(
      await (await getCustomers("search=Acme")).json(),
    );
    expect(byName.total).toBe(1);
    expect(byName.data[0]?.name).toBe("Acme Robotics");

    const byDomain = customerListResponseSchema.parse(
      await (await getCustomers("search=fjord.pay")).json(),
    );
    expect(byDomain.total).toBe(1);
    expect(byDomain.data[0]?.id).toBe("cust_06");
  });
});

/////////////////////////////////////////////////////////////
// Pagination — page / page_size + clamp
/////////////////////////////////////////////////////////////

describe("GET /api/customers — pagination", () => {
  it("paginates with page and page_size", async () => {
    // Distinct windows; total stays constant across pages.
    const page1 = customerListResponseSchema.parse(
      await (await getCustomers("page_size=10&page=1")).json(),
    );
    const page2 = customerListResponseSchema.parse(
      await (await getCustomers("page_size=10&page=2")).json(),
    );

    expect(page1.data).toHaveLength(10);
    expect(page2.data).toHaveLength(10);
    expect(page1.data[0]?.id).not.toBe(page2.data[0]?.id);
    expect(page1.total).toBe(page2.total);
  });

  it("clamps page when past the end", async () => {
    // 22 rows @ 10 → 3 pages; page 99 must land on the last window.
    const response = await getCustomers("page=99&page_size=10");
    const body = customerListResponseSchema.parse(await response.json());
    expect(body.page).toBe(3);
    expect(body.data.length).toBeGreaterThan(0);
  });
});

/////////////////////////////////////////////////////////////
// Explicit sort — overrides health-then-name
/////////////////////////////////////////////////////////////

describe("GET /api/customers — explicit sort", () => {
  it("honors explicit multi-level sort", async () => {
    // URL sort=name:asc wins over the triage default for that request.
    const response = await getCustomers("sort=name:asc&page_size=50");
    const body = customerListResponseSchema.parse(await response.json());
    const names = body.data.map((row) => row.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});
