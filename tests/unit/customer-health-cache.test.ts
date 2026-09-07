/**
 * @file tests/unit/customer-health-cache.test.ts
 *
 * Purpose: Unit coverage for tab-local health cache + cache-first fetch.
 * Used in: Vitest suite (`npm test`); Drawer tickets 19–20 / plan Step 11.
 * Used for: Lock set/get/clear and “prefetch then open reads cached payload”.
 *
 * Suites:
 * 1. Cache Map API — set / get / has / clear
 * 2. fetchCustomerHealth — returns cache without network; writes on network miss
 *
 * Steps (plan-clean Step 11 Testing):
 * 1. Assert set → get / has; clear empties.
 * 2. Prefetch-style setCached then fetchCustomerHealth returns same object (no fetch).
 * 3. Network miss validates JSON, writes cache, returns detail.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearCustomerHealthCache,
  fetchCustomerHealth,
  getCachedCustomerHealth,
  hasCachedCustomerHealth,
  setCachedCustomerHealth,
  type CustomerHealthDetail,
} from "@/entities/customer";
import { customerHealthFixtureById } from "@/tests/fixtures/customer-health";

/////////////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////////////

const SAMPLE: CustomerHealthDetail = customerHealthFixtureById.cust_03;

afterEach(() => {
  clearCustomerHealthCache();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/////////////////////////////////////////////////////////////
// 1. Cache Map API
/////////////////////////////////////////////////////////////

describe("customer health cache", () => {
  it("sets and gets by customer id", () => {
    expect(hasCachedCustomerHealth("cust_03")).toBe(false);
    expect(getCachedCustomerHealth("cust_03")).toBeUndefined();

    setCachedCustomerHealth("cust_03", SAMPLE);

    expect(hasCachedCustomerHealth("cust_03")).toBe(true);
    expect(getCachedCustomerHealth("cust_03")).toEqual(SAMPLE);
  });

  it("clear empties all entries", () => {
    setCachedCustomerHealth("cust_03", SAMPLE);
    setCachedCustomerHealth("cust_01", customerHealthFixtureById.cust_01);

    clearCustomerHealthCache();

    expect(hasCachedCustomerHealth("cust_03")).toBe(false);
    expect(getCachedCustomerHealth("cust_01")).toBeUndefined();
  });
});

/////////////////////////////////////////////////////////////
// 2. fetchCustomerHealth — cache-first + write-through
/////////////////////////////////////////////////////////////

describe("fetchCustomerHealth", () => {
  it("returns a prefetch/cache hit without calling fetch", async () => {
    setCachedCustomerHealth("cust_03", SAMPLE);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const detail = await fetchCustomerHealth("cust_03");

    expect(detail).toBe(SAMPLE);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches, validates, and writes the cache on miss", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(SAMPLE), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const detail = await fetchCustomerHealth("cust_03");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(detail.customerId).toBe("cust_03");
    expect(getCachedCustomerHealth("cust_03")).toEqual(detail);
  });

  it("maps 404 to not_found fetch error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: { code: "not_found", message: "Customer not found: missing" },
          }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    await expect(fetchCustomerHealth("missing")).rejects.toMatchObject({
      kind: "not_found",
    });
  });

  it("maps offline navigator to offline error", async () => {
    vi.stubGlobal("navigator", { onLine: false });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchCustomerHealth("cust_03")).rejects.toMatchObject({
      kind: "offline",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
