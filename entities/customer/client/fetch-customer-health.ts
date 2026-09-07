/**
 * @file entities/customer/client/fetch-customer-health.ts
 *
 * Purpose: Browser fetch for GET /api/customers/{id}/health + cache write-through.
 * Used in: `useCustomerHealth` (drawer), prefetch button (Step 12).
 * Used for: Validate JSON, map HTTP/offline failures, populate tab cache.
 *
 * Function Index:
 * - fetchCustomerHealth(id, options?) → CustomerHealthDetail
 *
 * Steps:
 * 1. Return cache hit unless `bypassCache`.
 * 2. Detect offline before fetch when possible.
 * 3. GET health; map status → CustomerHealthFetchError kinds.
 * 4. Validate body with Zod; write cache; return domain detail.
 */

import type { CustomerHealthDetail } from "../model/customer";
import { toCustomerHealth } from "../transform/to-customer-health";
import { CustomerHealthFetchError } from "./customer-health-fetch-error";
import {
  getCachedCustomerHealth,
  setCachedCustomerHealth,
} from "./health-cache";

export type FetchCustomerHealthOptions = {
  /** Abort in-flight request on rapid customer switches. */
  signal?: AbortSignal;
  /** Force network even when cache has a hit (rare; default false). */
  bypassCache?: boolean;
};

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

/**
 * Load health detail for a customer id (cache-first).
 *
 * @param customerId - Customer id
 * @param options - AbortSignal / bypassCache
 * @returns Domain health payload
 * @throws CustomerHealthFetchError on offline, HTTP, or invalid body
 */
export async function fetchCustomerHealth(
  customerId: string,
  options: FetchCustomerHealthOptions = {},
): Promise<CustomerHealthDetail> {
  const { signal, bypassCache = false } = options;
  const id = customerId.trim();

  if (!id) {
    throw new CustomerHealthFetchError(
      "invalid_response",
      "Customer id is required",
    );
  }

  //////////////////////////////////
  // 1. Cache hit — warm reopen / prefetch reuse (ADR-006).
  if (!bypassCache) {
    const cached = getCachedCustomerHealth(id);
    if (cached !== undefined) {
      return cached;
    }
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Offline before we even try (navigator may be undefined in SSR).
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new CustomerHealthFetchError(
      "offline",
      "You appear to be offline. Check your connection and try again.",
    );
  }
  //////////////////////////////////

  let response: Response;
  try {
    //////////////////////////////////
    // 3. Network GET — drawer-local; failures stay in the panel.
    response = await fetch(`/api/customers/${encodeURIComponent(id)}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
      cache: "no-store",
    });
    //////////////////////////////////
  } catch (error) {
    if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      throw new CustomerHealthFetchError("aborted", "Health request aborted");
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      throw new CustomerHealthFetchError(
        "offline",
        "You appear to be offline. Check your connection and try again.",
      );
    }

    throw new CustomerHealthFetchError(
      "network",
      "Could not reach the server. Try again.",
    );
  }

  if (!response.ok) {
    let message = `Health request failed (${response.status})`;
    let code: string | undefined;

    try {
      const body = (await response.json()) as ApiErrorBody;
      code = body.error?.code;
      if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Keep status-based message when body is not JSON.
    }

    if (response.status === 404 || code === "not_found") {
      throw new CustomerHealthFetchError("not_found", message, response.status);
    }

    throw new CustomerHealthFetchError("server", message, response.status);
  }

  //////////////////////////////////
  // 4. Validate + cache write-through.
  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    throw new CustomerHealthFetchError(
      "invalid_response",
      "Health response was not valid JSON",
      response.status,
    );
  }

  try {
    const detail = toCustomerHealth(raw as Parameters<typeof toCustomerHealth>[0]);
    setCachedCustomerHealth(id, detail);
    return detail;
  } catch {
    throw new CustomerHealthFetchError(
      "invalid_response",
      "Health response did not match the expected shape",
      response.status,
    );
  }
  //////////////////////////////////
}
