/**
 * @file tests/unit/customer-schemas.test.ts
 *
 * Purpose: Unit coverage for customer Zod schemas + transforms vs fixtures.
 * Used in: Vitest (`npm test`); Data & API ticket 4 gate.
 * Used for: Guard list/health contracts before API integration.
 *
 * Suites:
 * 1. customerListItemSchema / toCustomerListItem — fixture rows + reject bad health
 * 2. customerHealthSchema / toCustomerHealth — fixture payloads + reject missing notes
 * 3. customerListResponseSchema — paginated wire shape
 *
 * Steps (plan-clean Step 3 Testing):
 * 1. Assert every list fixture row parses via transform.
 * 2. Assert every health fixture payload parses via transform.
 * 3. Assert invalid shapes throw / fail safeParse.
 */

import { describe, expect, it } from "vitest";

import {
  customerHealthSchema,
  customerListItemSchema,
  customerListResponseSchema,
  toCustomerHealth,
  toCustomerListItem,
  toCustomerListItems,
} from "@/entities/customer";
import {
  customerHealthFixtureById,
  customerListFixture,
} from "@/tests/fixtures";

/////////////////////////////////////////////////////////////
// List item — schema + transform
/////////////////////////////////////////////////////////////

describe("customerListItemSchema / toCustomerListItem", () => {
  it("parses every list fixture row", () => {
    // Seed data must stay contract-valid or the repository will fail at load.
    const items = toCustomerListItems(customerListFixture);
    expect(items).toHaveLength(customerListFixture.length);
    expect(items[0]?.id).toBe("cust_01");
  });

  it("rejects an invalid health score", () => {
    // Health is 0–100; out-of-range must not become a domain row.
    expect(() =>
      toCustomerListItem({
        ...customerListFixture[0]!,
        health: 140,
      }),
    ).toThrow();
  });

  it("accepts a valid row via schema.safeParse", () => {
    // safeParse path used by callers that prefer Result over throw.
    const result = customerListItemSchema.safeParse(customerListFixture[2]);
    expect(result.success).toBe(true);
  });
});

/////////////////////////////////////////////////////////////
// Health detail — schema + transform
/////////////////////////////////////////////////////////////

describe("customerHealthSchema / toCustomerHealth", () => {
  it("parses every health fixture payload", () => {
    // Every list id should have a matching health fixture that validates.
    for (const [id, raw] of Object.entries(customerHealthFixtureById)) {
      const detail = toCustomerHealth(raw);
      expect(detail.customerId).toBe(id);
      expect(detail.events.length).toBeGreaterThan(0);
    }
  });

  it("rejects a payload missing notes", () => {
    // Required field gaps must fail at the entity boundary, not in the UI.
    const raw = { ...customerHealthFixtureById.cust_01! };
    // @ts-expect-error intentional invalid fixture mutation
    delete raw.notes;
    expect(() => customerHealthSchema.parse(raw)).toThrow();
  });
});

/////////////////////////////////////////////////////////////
// List response — paginated API wire shape
/////////////////////////////////////////////////////////////

describe("customerListResponseSchema", () => {
  it("accepts a paginated wire shape", () => {
    // Matches GET /api/customers JSON: data + page + page_size + total.
    const result = customerListResponseSchema.safeParse({
      data: customerListFixture.slice(0, 2),
      page: 1,
      page_size: 20,
      total: customerListFixture.length,
    });
    expect(result.success).toBe(true);
  });
});
