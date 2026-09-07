/**
 * @file entities/customer/client/health-cache.ts
 *
 * Purpose: Stub in-memory health cache (filled in drawer tickets).
 * Used in: future drawer host / prefetch button.
 * Used for: Reserve the client/ cache API without wiring fetch yet.
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
