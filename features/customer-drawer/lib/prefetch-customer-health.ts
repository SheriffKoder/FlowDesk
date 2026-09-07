/**
 * @file features/customer-drawer/lib/prefetch-customer-health.ts
 *
 * Purpose: Fire-and-forget health warm for the Open prefetch pill (ADR-005).
 * Used in: `CustomerPrefetchButton` (hover / focus).
 * Used for: Write entity tab cache without UI errors; dedupe in-flight ids.
 *
 * Function Index:
 * - prefetchCustomerHealth(customerId) → void
 *
 * Steps:
 * 1. Skip empty / already-cached ids.
 * 2. Skip if a prefetch for this id is already in flight.
 * 3. fetchCustomerHealth; swallow all failures (open path still fetches).
 */

import {
  fetchCustomerHealth,
  hasCachedCustomerHealth,
} from "@/entities/customer";

/** In-flight prefetch promises — avoid duplicate GETs on rapid hover/focus. */
const inflight = new Map<string, Promise<void>>();

/**
 * Warm the tab health cache for a customer id. Never throws to the caller.
 *
 * @param customerId - Customer id to prefetch
 */
export function prefetchCustomerHealth(customerId: string): void {
  const id = customerId.trim();
  if (!id) {
    return;
  }

  //////////////////////////////////
  // 1. Cache already warm — nothing to do.
  if (hasCachedCustomerHealth(id)) {
    return;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Reuse an in-flight request for the same id.
  if (inflight.has(id)) {
    return;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 3. Network warm — failures stay silent (ADR-005 / Step 12).
  const request = fetchCustomerHealth(id)
    .then(() => {
      // Cache write-through happens inside fetchCustomerHealth.
    })
    .catch(() => {
      // Intentional: prefetch must not surface errors in the list UI.
    })
    .finally(() => {
      inflight.delete(id);
    });

  inflight.set(id, request);
  //////////////////////////////////
}

/**
 * Clear in-flight tracking (tests only).
 */
export function clearPrefetchInflight(): void {
  inflight.clear();
}
