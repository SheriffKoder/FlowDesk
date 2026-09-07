/**
 * @file entities/customer/queries/list-customers.ts
 *
 * Purpose: List-customers use-case (filters + sort + page clamp).
 * Used in: GET /api/customers route adapter.
 * Used for: Keep route thin; honor health-then-name when sort is default.
 *
 * Note: Page clamp is inlined here so entities never import from views
 * (dependency direction: views → features → entities → shared).
 */

import type {
  CustomerListResult,
  ListCustomersInput,
} from "../model/customer-list-query";
import { queryCustomerList } from "../repository/customers-repository";

/**
 * Clamp a 1-based page into the valid window for total/pageSize.
 */
function clampListPage(
  page: number,
  totalItems: number,
  pageSize: number,
): number {
  if (totalItems <= 0) {
    return 1;
  }
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (page < 1) {
    return 1;
  }
  if (page > totalPages) {
    return totalPages;
  }
  return page;
}

/**
 * List customers for the health overview API.
 *
 * Clamps `page` when filters shrink the result set so callers never get an
 * empty page past the end.
 *
 * @param input - Search, segment, pagination, resolved sort
 * @returns Paginated domain list result
 */
export function listCustomers(input: ListCustomersInput): CustomerListResult {
  //////////////////////////////////
  // 1. Probe total with the requested page (may be out of range).
  const provisional = queryCustomerList(input);
  //////////////////////////////////

  //////////////////////////////////
  // 2. Clamp page against total, re-query if the page moved.
  const safePage = clampListPage(
    input.page,
    provisional.total,
    input.pageSize,
  );

  if (safePage === input.page) {
    return provisional;
  }

  return queryCustomerList({ ...input, page: safePage });
  //////////////////////////////////
}
