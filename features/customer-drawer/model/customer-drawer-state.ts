/**
 * @file features/customer-drawer/model/customer-drawer-state.ts
 *
 * Purpose: Pure open/close/hydrate rules for the customer details panel.
 * Used in: `useCustomerDrawer`, unit tests.
 * Used for: Instant panel open + URL `customerId` mirror without React in tests.
 *
 * Function Index:
 * - createDrawerStateFromUrl — cold load / hydrate
 * - openCustomerDrawer / closeCustomerDrawer — click paths
 * - drawerSelectedCustomerId — table highlight (open + id only)
 *
 * Steps:
 * 1. Treat absent/blank URL id as closed.
 * 2. Open stores id immediately; close clears both open and id.
 * 3. Selection is derived — never a separate selected-row store.
 *
 * See: `docs/adr/003-drawer-state-first-url-mirror.md`
 */

/////////////////////////////////////////////////////////////
// State
/////////////////////////////////////////////////////////////

export type CustomerDrawerState = {
  /** Local open flag — drives panel chrome before URL settles. */
  open: boolean;
  /** Target customer id while open; `null` when closed. */
  customerId: string | null;
};

export const CLOSED_CUSTOMER_DRAWER: CustomerDrawerState = {
  open: false,
  customerId: null,
};

/////////////////////////////////////////////////////////////
// Transitions
/////////////////////////////////////////////////////////////

/**
 * Hydrate local state from URL `customerId` (cold load or history nav).
 */
export function createDrawerStateFromUrl(
  urlCustomerId: string | null,
): CustomerDrawerState {
  if (urlCustomerId == null || urlCustomerId.trim() === "") {
    return CLOSED_CUSTOMER_DRAWER;
  }

  return {
    open: true,
    customerId: urlCustomerId,
  };
}

/**
 * Open (or retarget) the panel for a customer id.
 */
export function openCustomerDrawer(customerId: string): CustomerDrawerState {
  const trimmed = customerId.trim();
  if (trimmed === "") {
    return CLOSED_CUSTOMER_DRAWER;
  }

  return {
    open: true,
    customerId: trimmed,
  };
}

/**
 * Close the panel and clear the selected id.
 */
export function closeCustomerDrawer(): CustomerDrawerState {
  return CLOSED_CUSTOMER_DRAWER;
}

/**
 * Row highlight id — derived from open state only (ADR-003).
 */
export function drawerSelectedCustomerId(
  state: CustomerDrawerState,
): string | null {
  return state.open ? state.customerId : null;
}
