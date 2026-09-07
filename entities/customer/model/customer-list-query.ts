/**
 * @file entities/customer/model/customer-list-query.ts
 *
 * Purpose: Input/output types for the list-customers use-case.
 * Used in: queries/list-customers, repository, API route adapter.
 * Used for: Honor URL contract filters + resolved sort without importing views.
 *
 * Sort field allow-list lives in {@link ./field-catalog.ts} so views and
 * entity share one catalog.
 */

import type { CustomerListItem } from "./customer";
import type { CustomerSegment } from "./segment";
import type { CustomerListSortField } from "./field-catalog";

export {
  CUSTOMER_LIST_SORT_FIELDS,
  type CustomerListSortField,
} from "./field-catalog";

export type CustomerListSortOrder = "asc" | "desc";

export type CustomerListSortKey = {
  field: CustomerListSortField;
  order: CustomerListSortOrder;
};

/**
 * Sort plan for the list query.
 * `default` = health risk-first then name A→Z (URL omitted sort).
 * `explicit` = multi-level keys in priority order (url-kit append dialect).
 */
export type CustomerListSort =
  | { kind: "default" }
  | {
      kind: "explicit";
      keys: CustomerListSortKey[];
    };

export type ListCustomersInput = {
  search: string;
  /**
   * Selected segments (OR). Empty array = all segments (no filter).
   */
  segments: CustomerSegment[];
  page: number;
  pageSize: number;
  sort: CustomerListSort;
};

export type CustomerListResult = {
  data: CustomerListItem[];
  page: number;
  pageSize: number;
  total: number;
};
