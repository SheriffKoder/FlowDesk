/**
 * @file Public exports for the customer-drawer feature.
 *
 * Workflow: open customer details beside the list (in-layout panel),
 * mirror `customerId` in the URL, hydrate from deep links.
 */

export {
  useCustomerDrawer,
  type UseCustomerDrawerOptions,
  type UseCustomerDrawerResult,
} from "./hooks/use-customer-drawer";

export {
  CLOSED_CUSTOMER_DRAWER,
  closeCustomerDrawer,
  createDrawerStateFromUrl,
  drawerSelectedCustomerId,
  openCustomerDrawer,
  type CustomerDrawerState,
} from "./model/customer-drawer-state";

export {
  CustomerDetailsPanel,
  type CustomerDetailsPanelProps,
} from "./ui/customer-details-panel";
