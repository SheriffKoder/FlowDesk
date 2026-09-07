/**
 * @file Public exports for the customer-drawer feature.
 *
 * Workflow: open customer details beside the list (in-layout panel),
 * mirror `customerId` in the URL, hydrate from deep links, load health.
 */

export {
  useCustomerDrawer,
  type UseCustomerDrawerOptions,
  type UseCustomerDrawerResult,
} from "./hooks/use-customer-drawer";

export {
  useCustomerHealth,
  type CustomerHealthStatus,
  type UseCustomerHealthOptions,
  type UseCustomerHealthResult,
} from "./hooks/use-customer-health";

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

export {
  CustomerHealthBody,
  type CustomerHealthBodyProps,
} from "./ui/customer-health-body";

export { CustomerHealthBodySkeleton } from "./ui/customer-health-body-skeleton";

export {
  CustomerHealthError,
  type CustomerHealthErrorProps,
} from "./ui/customer-health-error";

export {
  CustomerPrefetchButton,
  type CustomerPrefetchButtonProps,
} from "./ui/customer-prefetch-button";

export {
  clearPrefetchInflight,
  prefetchCustomerHealth,
} from "./lib/prefetch-customer-health";
