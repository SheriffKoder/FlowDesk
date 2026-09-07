/**
 * @file views/customer-health/server/load-customer-list.ts
 *
 * Purpose: Server use-case — searchParams → listCustomers → table/page props.
 * Used in: `app/customers/health/page.tsx`, Integration 3 tests.
 * Used for: Keep the route thin; fixtures stay behind the entity repository
 *   (not imported by the view). No self-HTTP to `/api/customers` on the server.
 *
 * Function Index:
 * - loadCustomerList(rawSearchParams) → CustomerListPageData
 *
 * Steps:
 * 1. Parse URL contract (`parseListParams`).
 * 2. Resolve sort + map to entity input (`resolveListSort` / `toEntityListSort`).
 * 3. Call `listCustomers`; shape rows + empty-state kind for the table.
 */

import {
  listCustomers,
  type CustomerListItem,
} from "@/entities/customer";

import { parseListParams, type RawSearchParams } from "../lib/parse-list-params";
import { resolveListSort } from "../lib/resolve-list-sort";
import { toEntityListSort } from "../lib/to-entity-list-sort";
import type { CustomerListEmptyKind } from "../model/customer-list-empty";
import type { CustomerHealthUrlParams } from "../model/list-url-params";

export type { CustomerListEmptyKind };

/////////////////////////////////////////////////////////////
// Page data shape — what the composition shell passes to the table
/////////////////////////////////////////////////////////////

/**
 * Server-shaped list props for Customer Health first paint.
 */
export type CustomerListPageData = {
  /** Current page of domain rows for the table. */
  rows: CustomerListItem[];
  /** Total matching rows after filters (pre-pagination). */
  total: number;
  /** Effective page after clamp. */
  page: number;
  pageSize: number;
  /** Parsed URL state (includes `customerId` for drawer selection). */
  params: CustomerHealthUrlParams;
  /**
   * Empty-state kind when `rows.length === 0`:
   * - `true` — no customers at all (no search/segment)
   * - `filtered` — filters/search matched nothing
   * - `null` — table has rows
   */
  emptyKind: CustomerListEmptyKind;
};

/////////////////////////////////////////////////////////////
// Empty-kind helper
/////////////////////////////////////////////////////////////

/**
 * Decide true vs filtered empty from totals + active filters.
 */
function resolveEmptyKind(
  total: number,
  params: CustomerHealthUrlParams,
): CustomerListEmptyKind {
  if (total > 0) {
    return null;
  }

  const hasFilters =
    params.search.trim().length > 0 || params.segment !== null;

  return hasFilters ? "filtered" : "true";
}

/////////////////////////////////////////////////////////////
// loadCustomerList
/////////////////////////////////////////////////////////////

/**
 * Load the customer list for the health page from raw `searchParams`.
 *
 * Calls the entity use-case directly (RSC-friendly). Fixtures remain inside
 * the entity repository — the view never imports seed data.
 *
 * @param rawSearchParams - Next.js `searchParams` or `URLSearchParams`
 * @returns Rows + meta + empty kind for composition
 *
 * @example
 * ```ts
 * const list = loadCustomerList({ segment: "at_risk", page: "1" });
 * // list.rows are at_risk customers, health-then-name when sort absent
 * ```
 */
export function loadCustomerList(
  rawSearchParams: RawSearchParams = {},
): CustomerListPageData {
  //////////////////////////////////
  // 1. Parse URL contract (safe fallbacks for invalid values).
  const params = parseListParams(rawSearchParams);
  //////////////////////////////////

  //////////////////////////////////
  // 2. Resolve sort dialect → entity query input.
  const sort = toEntityListSort(resolveListSort(params));
  //////////////////////////////////

  //////////////////////////////////
  // 3. Entity list use-case (filter / sort / paginate / clamp).
  const result = listCustomers({
    search: params.search,
    segment: params.segment,
    page: params.page,
    pageSize: params.pageSize,
    sort,
  });

  return {
    rows: result.data,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    params,
    emptyKind: resolveEmptyKind(result.total, params),
  };
  //////////////////////////////////
}
