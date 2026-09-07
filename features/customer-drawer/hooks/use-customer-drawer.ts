"use client";

/**
 * @file features/customer-drawer/hooks/use-customer-drawer.ts
 *
 * Purpose: Local-open details panel + mirror/hydrate URL `customerId`.
 * Used in: Customer Health list shell (row click → in-layout DetailsPanel).
 * Used for: Instant panel open; shareable deep link; back/forward coherence.
 *
 * Function Index:
 * - useCustomerDrawer({ urlCustomerId, onMirrorCustomerId })
 *
 * Steps:
 * 1. Seed local state from URL (cold load with `customerId` opens immediately).
 * 2. `openCustomer` / `close` update local state first, then mirror URL.
 * 3. When URL id changes externally (back/forward), hydrate local state.
 * 4. Expose `selectedCustomerId` derived from open + id (no duplicate store).
 *
 * See: `docs/adr/003-drawer-state-first-url-mirror.md`
 */

import { useEffect, useRef, useState } from "react";

import {
  closeCustomerDrawer,
  createDrawerStateFromUrl,
  drawerSelectedCustomerId,
  openCustomerDrawer,
  type CustomerDrawerState,
} from "../model/customer-drawer-state";

export type UseCustomerDrawerOptions = {
  /** Current URL `customerId` (from parsed list params). */
  urlCustomerId: string | null;
  /**
   * Mirror open/close into the URL without owning list filters.
   * Caller typically `patchParams({ customerId })` (does not reset page).
   */
  onMirrorCustomerId: (customerId: string | null) => void;
};

export type UseCustomerDrawerResult = {
  open: boolean;
  customerId: string | null;
  /** Table selection — same as open customer id, else null. */
  selectedCustomerId: string | null;
  openCustomer: (customerId: string) => void;
  close: () => void;
};

/**
 * State-first customer details panel controller (URL mirrors afterward).
 */
export function useCustomerDrawer({
  urlCustomerId,
  onMirrorCustomerId,
}: UseCustomerDrawerOptions): UseCustomerDrawerResult {
  const [state, setState] = useState<CustomerDrawerState>(() =>
    createDrawerStateFromUrl(urlCustomerId),
  );

  const onMirrorRef = useRef(onMirrorCustomerId);
  onMirrorRef.current = onMirrorCustomerId;

  /**
   * Last id we pushed via open/close — ignore echoes so soft-nav
   * does not fight local open animation.
   */
  const lastMirroredRef = useRef<string | null>(urlCustomerId);

  useEffect(() => {
    //////////////////////////////////
    // 3. External URL only (back/forward / shared link) — skip our echoes.
    if (urlCustomerId === lastMirroredRef.current) {
      return;
    }
    lastMirroredRef.current = urlCustomerId;
    setState(createDrawerStateFromUrl(urlCustomerId));
    //////////////////////////////////
  }, [urlCustomerId]);

  function openCustomer(customerId: string): void {
    //////////////////////////////////
    // 2a. Local open first (instant shell), then mirror URL.
    const next = openCustomerDrawer(customerId);
    setState(next);
    lastMirroredRef.current = next.customerId;
    onMirrorRef.current(next.customerId);
    //////////////////////////////////
  }

  function close(): void {
    //////////////////////////////////
    // 2b. Local close first, then strip `customerId` from the URL.
    setState(closeCustomerDrawer());
    lastMirroredRef.current = null;
    onMirrorRef.current(null);
    //////////////////////////////////
  }

  return {
    open: state.open,
    customerId: state.customerId,
    selectedCustomerId: drawerSelectedCustomerId(state),
    openCustomer,
    close,
  };
}
