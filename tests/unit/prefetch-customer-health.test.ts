/**
 * @file tests/unit/prefetch-customer-health.test.ts
 *
 * Purpose: Unit coverage for silent health prefetch (ADR-005 / Step 12).
 * Used for: Lock cache-skip, in-flight dedupe, and “failures never throw”.
 *
 * Sections:
 * 1. Setup — mock fetchCustomerHealth + clear cache / inflight
 * 2. prefetchCustomerHealth — skip cached; call once; silent reject
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearCustomerHealthCache,
  setCachedCustomerHealth,
  type CustomerHealthDetail,
} from "@/entities/customer";
import {
  clearPrefetchInflight,
  prefetchCustomerHealth,
} from "@/features/customer-drawer";

/////////////////////////////////////////////////////////////
// 1. Setup
/////////////////////////////////////////////////////////////

const fetchMock = vi.hoisted(() => vi.fn());

vi.mock("@/entities/customer", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/customer")>();
  return {
    ...actual,
    fetchCustomerHealth: fetchMock,
  };
});

const sampleDetail = {
  customerId: "cust_01",
  events: [],
  usage: [],
  notes: "Warm",
} as CustomerHealthDetail;

beforeEach(() => {
  clearCustomerHealthCache();
  clearPrefetchInflight();
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(sampleDetail);
});

afterEach(() => {
  clearCustomerHealthCache();
  clearPrefetchInflight();
});

/////////////////////////////////////////////////////////////
// 2. prefetchCustomerHealth
/////////////////////////////////////////////////////////////

describe("prefetchCustomerHealth", () => {
  it("skips the network when the tab cache already has the id", () => {
    setCachedCustomerHealth("cust_01", sampleDetail);

    prefetchCustomerHealth("cust_01");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls fetchCustomerHealth once and dedupes overlapping prefetches", async () => {
    let resolveFetch!: (value: CustomerHealthDetail) => void;
    fetchMock.mockImplementation(
      () =>
        new Promise<CustomerHealthDetail>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    prefetchCustomerHealth("cust_01");
    prefetchCustomerHealth("cust_01");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch(sampleDetail);
    await Promise.resolve();
  });

  it("swallows fetch failures so the list UI stays quiet", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    expect(() => {
      prefetchCustomerHealth("cust_01");
    }).not.toThrow();

    await Promise.resolve();
    await Promise.resolve();
  });
});
