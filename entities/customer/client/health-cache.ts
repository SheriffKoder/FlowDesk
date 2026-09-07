/**
 * @file entities/customer/client/health-cache.ts
 *
 * Purpose: Tab-local in-memory cache for customer health payloads.
 * Used in: `fetch-customer-health`, drawer hook, prefetch (Step 12).
 * Used for: Warm reopen without a second spinner; shared write path for prefetch.
 *
 * Function Index:
 * - getCachedCustomerHealth(id) → detail | undefined
 * - setCachedCustomerHealth(id, detail) → void
 * - hasCachedCustomerHealth(id) → boolean
 * - clearCustomerHealthCache() → void
 *
 * Notes:
 * - Module `Map` (ADR-004 / ADR-006) — no TanStack this phase.
 * - Cache lives for the browser tab only; refresh clears it.
 */

import type { CustomerHealthDetail } from "../model/customer";

const healthCache = new Map<string, CustomerHealthDetail>();

/**
 * Read a cached health payload by customer id.
 *
 * @param customerId - Customer id
 * @returns Cached detail or undefined on miss
 */
export function getCachedCustomerHealth(
  customerId: string,
): CustomerHealthDetail | undefined {
  return healthCache.get(customerId);
}

/**
 * Whether the tab cache already holds this customer’s health payload.
 *
 * @param customerId - Customer id
 */
export function hasCachedCustomerHealth(customerId: string): boolean {
  return healthCache.has(customerId);
}

/**
 * Store a health payload in the tab-local cache.
 *
 * @param customerId - Customer id
 * @param detail - Health payload to cache
 */
export function setCachedCustomerHealth(
  customerId: string,
  detail: CustomerHealthDetail,
): void {
  healthCache.set(customerId, detail);
}

/**
 * Clear the health cache (tests / logout later).
 */
export function clearCustomerHealthCache(): void {
  healthCache.clear();
}
