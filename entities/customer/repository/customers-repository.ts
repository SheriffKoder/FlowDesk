/**
 * @file entities/customer/repository/customers-repository.ts
 *
 * Purpose: Read fixture customers, filter, sort, and paginate.
 * Used in: queries/list-customers.
 * Used for: Demo data access without a real DB this phase.
 *
 * Steps:
 * 1. Load + validate fixture rows via transform.
 * 2. Filter by search (catalog searchable fields) and segment.
 * 3. Sort by resolved plan (default keys from catalog or explicit).
 * 4. Slice the requested page.
 */

import { customerListFixture } from "@/tests/fixtures";

import type { CustomerListItem } from "../model/customer";
import {
  customerListMatchesSearch,
  customerListSortValue,
  DEFAULT_CUSTOMER_LIST_SORT_KEYS,
} from "../model/field-catalog";
import type {
  CustomerListResult,
  CustomerListSort,
  CustomerListSortKey,
  ListCustomersInput,
} from "../model/customer-list-query";
import { toCustomerListItems } from "../transform/to-customer-list-item";
import { CustomerUpstreamError } from "../errors/customer-errors";

/////////////////////////////////////////////////////////////
// Fixture load (validated once per call — fine for demo scale)
/////////////////////////////////////////////////////////////

/**
 * Load all validated customer list rows from fixtures.
 *
 * @returns Domain CustomerListItem[]
 * @throws CustomerUpstreamError when fixtures fail schema validation
 */
export function loadCustomerListItems(): CustomerListItem[] {
  try {
    return toCustomerListItems(customerListFixture);
  } catch (error) {
    throw new CustomerUpstreamError(
      error instanceof Error ? error.message : "Invalid customer fixtures",
    );
  }
}

/////////////////////////////////////////////////////////////
// Filter / sort / page
/////////////////////////////////////////////////////////////

/**
 * Compare two items by an ordered list of sort keys.
 */
function compareByKeys(
  a: CustomerListItem,
  b: CustomerListItem,
  keys: readonly CustomerListSortKey[],
): number {
  for (const { field, order } of keys) {
    const direction = order === "asc" ? 1 : -1;
    const left = customerListSortValue(a, field);
    const right = customerListSortValue(b, field);

    if (left < right) {
      return -1 * direction;
    }
    if (left > right) {
      return 1 * direction;
    }
  }

  return a.name.localeCompare(b.name);
}

/**
 * Compare two items for the resolved sort plan.
 */
function compareCustomers(
  a: CustomerListItem,
  b: CustomerListItem,
  sort: CustomerListSort,
): number {
  if (sort.kind === "default") {
    return compareByKeys(a, b, DEFAULT_CUSTOMER_LIST_SORT_KEYS);
  }

  return compareByKeys(a, b, sort.keys);
}

/**
 * Filter, sort, and paginate the customer list from fixtures.
 *
 * @param input - List query filters + resolved sort
 * @returns Paginated CustomerListResult (page may be beyond last — clamp in query)
 */
export function queryCustomerList(
  input: ListCustomersInput,
): CustomerListResult {
  //////////////////////////////////
  // 1. Load + filter
  const all = loadCustomerListItems();
  const filtered = all.filter((item) => {
    if (!customerListMatchesSearch(item, input.search)) {
      return false;
    }
    if (
      input.segments.length > 0 &&
      !input.segments.includes(item.segment)
    ) {
      return false;
    }
    return true;
  });
  //////////////////////////////////

  //////////////////////////////////
  // 2. Sort
  const sorted = [...filtered].sort((a, b) =>
    compareCustomers(a, b, input.sort),
  );
  //////////////////////////////////

  //////////////////////////////////
  // 3. Paginate (caller may clamp page first)
  const start = (input.page - 1) * input.pageSize;
  const data = sorted.slice(start, start + input.pageSize);
  //////////////////////////////////

  return {
    data,
    page: input.page,
    pageSize: input.pageSize,
    total: filtered.length,
  };
}
