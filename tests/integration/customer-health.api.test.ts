/**
 * @file tests/integration/customer-health.api.test.ts
 *
 * Purpose: Integration 2 — GET /api/customers/{id}/health.
 * Used in: Vitest; Data & API ticket 6 gate.
 * Used for: Happy path + not-found status mapping.
 *
 * Function Index:
 * - getHealth(id) — call route GET with a customer id param
 *
 * Suites:
 * 1. Happy path — known id returns validated health detail
 * 2. Not found — unknown id → 404 + not_found code
 *
 * Steps (plan-clean Step 3 Testing):
 * 1. Assert 200 + schema-valid body for a fixture customer.
 * 2. Assert 404 + typed error code for a missing id.
 */

import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/customers/[id]/health/route";
import { customerHealthSchema } from "@/entities/customer";

/////////////////////////////////////////////////////////////
// Test helpers
/////////////////////////////////////////////////////////////

/**
 * Invoke GET /api/customers/[id]/health with a route param.
 *
 * @param id - Customer id (path param)
 * @returns Route Response
 */
async function getHealth(id: string): Promise<Response> {
  return GET(new Request(`http://localhost/api/customers/${id}/health`), {
    params: Promise.resolve({ id }),
  });
}

/////////////////////////////////////////////////////////////
// Happy path — known customer
/////////////////////////////////////////////////////////////

describe("GET /api/customers/{id}/health — happy path", () => {
  it("returns health detail for a known customer", async () => {
    // Fixture-backed payload must validate and include events / usage / notes.
    const response = await getHealth("cust_03");
    expect(response.status).toBe(200);

    const body = customerHealthSchema.parse(await response.json());
    expect(body.customerId).toBe("cust_03");
    expect(body.events.length).toBeGreaterThan(0);
    expect(body.usage.length).toBeGreaterThan(0);
    expect(body.notes.length).toBeGreaterThan(0);
  });
});

/////////////////////////////////////////////////////////////
// Not found — unknown customer
/////////////////////////////////////////////////////////////

describe("GET /api/customers/{id}/health — not found", () => {
  it("returns 404 for an unknown customer", async () => {
    // CustomerNotFoundError maps to 404 + error.code = not_found.
    const response = await getHealth("cust_missing");
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.error.code).toBe("not_found");
  });
});
