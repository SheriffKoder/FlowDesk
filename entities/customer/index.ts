/**
 * @file entities/customer/index.ts
 *
 * Purpose: Public API for the customer entity.
 * Used in: app/api routes, views (later), tests.
 * Used for: Enforce public-export-only imports across slices.
 */

/////////////////////////////////////////////////////////////
// Model
/////////////////////////////////////////////////////////////

export type {
  CustomerHealthDetail,
  CustomerHealthEvent,
  CustomerListItem,
  CustomerUsagePoint,
} from "./model/customer";
export type {
  CustomerListResult,
  CustomerListSort,
  CustomerListSortField,
  CustomerListSortOrder,
  ListCustomersInput,
} from "./model/customer-list-query";
export {
  CUSTOMER_LIST_SORT_FIELDS,
} from "./model/customer-list-query";
export {
  CUSTOMER_SEGMENTS,
  type CustomerSegment,
} from "./model/segment";

/////////////////////////////////////////////////////////////
// Schema
/////////////////////////////////////////////////////////////

export {
  customerListItemSchema,
  type CustomerListItemParsed,
  type CustomerListItemRaw,
} from "./schema/customer-list-item.schema";
export {
  customerListResponseSchema,
  type CustomerListResponseParsed,
  type CustomerListResponseRaw,
} from "./schema/customer-list-response.schema";
export {
  customerHealthSchema,
  type CustomerHealthParsed,
  type CustomerHealthRaw,
} from "./schema/customer-health.schema";

/////////////////////////////////////////////////////////////
// Transform
/////////////////////////////////////////////////////////////

export {
  toCustomerListItem,
  toCustomerListItems,
} from "./transform/to-customer-list-item";
export { toCustomerHealth } from "./transform/to-customer-health";

/////////////////////////////////////////////////////////////
// Queries
/////////////////////////////////////////////////////////////

export { listCustomers } from "./queries/list-customers";
export { getCustomerHealth } from "./queries/get-customer-health";

/////////////////////////////////////////////////////////////
// Errors
/////////////////////////////////////////////////////////////

export {
  CustomerError,
  CustomerNotFoundError,
  CustomerUpstreamError,
  CustomerValidationError,
  isCustomerError,
  type CustomerErrorCode,
} from "./errors/customer-errors";

/////////////////////////////////////////////////////////////
// Client cache stub
/////////////////////////////////////////////////////////////

export {
  clearCustomerHealthCache,
  getCachedCustomerHealth,
  setCachedCustomerHealth,
} from "./client/health-cache";
