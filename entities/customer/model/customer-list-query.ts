/**
 * @file entities/customer/model/customer-list-query.ts
 *
 * Purpose: Input/output types for the list-customers use-case.
 * Used in: queries/list-customers, repository, API route adapter.
 * Used for: Honor URL contract filters + resolved sort without importing views.
 */

import type { CustomerListItem } from "./customer";
import type { CustomerSegment } from "./segment";

export const CUSTOMER_LIST_SORT_FIELDS = [
  "name",
  "mrr",
  "last_active",
  "health",
  "owner",
] as const;

export type CustomerListSortField = (typeof CUSTOMER_LIST_SORT_FIELDS)[number];

export type CustomerListSortOrder = "asc" | "desc";

/**
 * Sort plan for the list query.
 * `default` = health risk-first then name A→Z (URL omitted sort).
 */
export type CustomerListSort =
  | { kind: "default" }
  | {
      kind: "explicit";
      field: CustomerListSortField;
      order: CustomerListSortOrder;
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
