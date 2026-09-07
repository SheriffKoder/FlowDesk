"use client";

/**
 * @file shared/hooks/use-delayed-pending.ts
 *
 * Purpose: Delay a pending flag so fast transitions do not flicker UI.
 * Used in: `useListUrl` (table/pagination dim); any `useTransition` pending UX.
 * Used for: Soft-nav that often finishes under ~200ms should leave opacity alone.
 *
 * Function Index:
 * - useDelayedPending(isPending, delayMs?) → delayed boolean
 *
 * Steps:
 * 1. When pending becomes false → clear shown flag immediately (cancel timer).
 * 2. When pending becomes true → start timer; only then set shown true.
 */

import { useEffect, useState } from "react";

/** Default quiet period before showing pending chrome (ms). */
export const DEFAULT_PENDING_DIM_DELAY_MS = 200;

/**
 * Mirror `isPending`, but only flip to `true` after `delayMs`.
 * Clears immediately when `isPending` goes false so fast/cached work never dims.
 *
 * @param isPending - Raw pending from `useTransition` (or similar)
 * @param delayMs - Wait before exposing true (default 200)
 */
export function useDelayedPending(
  isPending: boolean,
  delayMs: number = DEFAULT_PENDING_DIM_DELAY_MS,
): boolean {
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    //////////////////////////////////
    // 1. Settled — drop dim immediately; cancel any in-flight delay.
    if (!isPending) {
      setShowPending(false);
      return;
    }
    //////////////////////////////////

    //////////////////////////////////
    // 2. Still pending after delayMs → safe to show dim (slow path only).
    const timer = setTimeout(() => {
      setShowPending(true);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
    //////////////////////////////////
  }, [isPending, delayMs]);

  return showPending;
}
