/**
 * @file entities/customer/repository/customers-repository.ts
 *
 * Purpose: Read fixture customers, filter, sort, and paginate.
 * Used in: queries/list-customers.
 * Used for: Demo data access without a real DB this phase.
 *
 * Steps:
 * 1. Load + validate fixture rows via transform.
 * 2. Filter by search (name/domain) and segment.
 * 3. Sort by resolved plan (default health-then-name or explicit).
 * 4. Slice the requested page.
 */

import { customerListFixture } from "@/tests/fixtures";

import type { CustomerListItem } from "../model/customer";
import type {
  CustomerListResult,
  CustomerListSort,
  CustomerListSortField,
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
 * Case-insensitive match against name or domain.
 */
function matchesSearch(item: CustomerListItem, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  return (
    item.name.toLowerCase().includes(needle) ||
    item.domain.toLowerCase().includes(needle)
  );
}

/**
 * Read a comparable value for an explicit sort field.
 */
function sortValue(
  item: CustomerListItem,
  field: CustomerListSortField,
): string | number {
  switch (field) {
    case "name":
      return item.name.toLowerCase();
    case "mrr":
      return item.mrr;
    case "last_active":
      return item.lastActive;
    case "health":
      return item.health;
    case "owner":
      return item.owner.toLowerCase();
    default: {
      const _exhaustive: never = field;
      return _exhaustive;
    }
  }
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
    // Health ascending = risk-first; name A→Z breaks ties.
    if (a.health !== b.health) {
      return a.health - b.health;
    }
    return a.name.localeCompare(b.name);
  }

  const direction = sort.order === "asc" ? 1 : -1;
  const left = sortValue(a, sort.field);
  const right = sortValue(b, sort.field);

  if (left < right) {
    return -1 * direction;
  }
  if (left > right) {
    return 1 * direction;
  }
  // Stable tie-break by name.
  return a.name.localeCompare(b.name);
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
    if (!matchesSearch(item, input.search)) {
      return false;
    }
    if (input.segment !== null && item.segment !== input.segment) {
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
