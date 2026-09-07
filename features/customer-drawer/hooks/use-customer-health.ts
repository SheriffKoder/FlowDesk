/**
 * @file features/customer-drawer/hooks/use-customer-health.ts
 *
 * Purpose: Load drawer health for the open customer (cache-first, abortable).
 * Used in: CustomerDetailsPanel body.
 * Used for: Loading / error / retry without tripping route `error.tsx`.
 *
 * Function Index:
 * - useCustomerHealth({ customerId, enabled }) → status + data + retry
 *
 * Steps:
 * 1. On render: if tab cache has the id, return success immediately (no skeleton flash).
 * 2. On id change: abort prior fetch; fetch miss via entity client.
 * 3. Ignore aborted / stale completions so rapid switches never flash wrong body.
 * 4. `retry` re-fetches with bypassCache when caller asks.
 *
 * See: ADR-003 (keyed/cancelled), ADR-006 (client cache).
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchCustomerHealth,
  getCachedCustomerHealth,
  isCustomerHealthFetchError,
  type CustomerHealthDetail,
  type CustomerHealthFetchErrorKind,
} from "@/entities/customer";

export type CustomerHealthStatus = "idle" | "loading" | "success" | "error";

export type UseCustomerHealthOptions = {
  /** Open customer id; null when panel closed / no selection. */
  customerId: string | null;
  /** When false, do not fetch (panel closed). */
  enabled?: boolean;
};

export type UseCustomerHealthResult = {
  status: CustomerHealthStatus;
  data: CustomerHealthDetail | null;
  errorKind: CustomerHealthFetchErrorKind | null;
  errorMessage: string | null;
  /** Re-run fetch for the current id (network path; bypasses cache). */
  retry: () => void;
};

type HealthState = {
  customerId: string | null;
  status: CustomerHealthStatus;
  data: CustomerHealthDetail | null;
  errorKind: CustomerHealthFetchErrorKind | null;
  errorMessage: string | null;
};

const IDLE_STATE: HealthState = {
  customerId: null,
  status: "idle",
  data: null,
  errorKind: null,
  errorMessage: null,
};

function stateFromCache(customerId: string): HealthState {
  const cached = getCachedCustomerHealth(customerId);
  if (cached === undefined) {
    return {
      customerId,
      status: "loading",
      data: null,
      errorKind: null,
      errorMessage: null,
    };
  }

  return {
    customerId,
    status: "success",
    data: cached,
    errorKind: null,
    errorMessage: null,
  };
}

function mapError(error: unknown): Pick<HealthState, "errorKind" | "errorMessage"> {
  if (isCustomerHealthFetchError(error)) {
    return { errorKind: error.kind, errorMessage: error.message };
  }

  return {
    errorKind: "server",
    errorMessage: "Something went wrong loading health details.",
  };
}

/**
 * Cache-first health loader for the in-layout details panel.
 */
export function useCustomerHealth({
  customerId,
  enabled = true,
}: UseCustomerHealthOptions): UseCustomerHealthResult {
  const activeId = enabled ? customerId : null;

  const [state, setState] = useState<HealthState>(() =>
    activeId ? stateFromCache(activeId) : IDLE_STATE,
  );

  /** Bumps on retry so the effect re-runs for the same id. */
  const [retryToken, setRetryToken] = useState(0);
  /**
   * When set, that customer id skips render-time cache until the bypass
   * fetch settles (keeps Retry from flashing stale success).
   */
  const bypassForIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeId == null) {
      bypassForIdRef.current = null;
      setState(IDLE_STATE);
      return;
    }

    //////////////////////////////////
    // 2. Seed cache / loading; abort prior request on id change.
    const bypassCache = bypassForIdRef.current === activeId;

    if (!bypassCache) {
      const seeded = stateFromCache(activeId);
      setState(seeded);
      if (seeded.status === "success") {
        return;
      }
    } else {
      setState({
        customerId: activeId,
        status: "loading",
        data: null,
        errorKind: null,
        errorMessage: null,
      });
    }

    const controller = new AbortController();
    const requestedId = activeId;

    void (async () => {
      try {
        const detail = await fetchCustomerHealth(requestedId, {
          signal: controller.signal,
          bypassCache,
        });

        //////////////////////////////////
        // 3. Drop stale completions (abort usually covers this too).
        if (controller.signal.aborted) {
          return;
        }

        if (bypassForIdRef.current === requestedId) {
          bypassForIdRef.current = null;
        }

        setState({
          customerId: requestedId,
          status: "success",
          data: detail,
          errorKind: null,
          errorMessage: null,
        });
        //////////////////////////////////
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (isCustomerHealthFetchError(error) && error.kind === "aborted") {
          return;
        }

        if (bypassForIdRef.current === requestedId) {
          bypassForIdRef.current = null;
        }

        const mapped = mapError(error);
        setState({
          customerId: requestedId,
          status: "error",
          data: null,
          ...mapped,
        });
      }
    })();

    return () => {
      controller.abort();
    };
    //////////////////////////////////
  }, [activeId, retryToken]);

  const retry = useCallback(() => {
    //////////////////////////////////
    // 4. Force network path even if a stale/bad cache entry exists.
    if (activeId == null) {
      return;
    }
    bypassForIdRef.current = activeId;
    setState({
      customerId: activeId,
      status: "loading",
      data: null,
      errorKind: null,
      errorMessage: null,
    });
    setRetryToken((token) => token + 1);
    //////////////////////////////////
  }, [activeId]);

  //////////////////////////////////
  // 1. Warm reopen: resolve cache on render so the first paint is content,
  // not skeleton (effect alone runs after paint and flashed loading).
  if (activeId != null && bypassForIdRef.current !== activeId) {
    const cached = getCachedCustomerHealth(activeId);
    if (cached !== undefined) {
      return {
        status: "success",
        data: cached,
        errorKind: null,
        errorMessage: null,
        retry,
      };
    }
  }
  //////////////////////////////////

  const matches =
    state.customerId === activeId ||
    (activeId == null && state.customerId == null);

  return {
    status: matches ? state.status : activeId ? "loading" : "idle",
    data: matches ? state.data : null,
    errorKind: matches ? state.errorKind : null,
    errorMessage: matches ? state.errorMessage : null,
    retry,
  };
}
