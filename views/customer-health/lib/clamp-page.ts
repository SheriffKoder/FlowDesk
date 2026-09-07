/**
 * @file views/customer-health/lib/clamp-page.ts
 *
 * Purpose: Keep the list `page` inside the valid range after totals change.
 * Used in: Pagination controls / server list wiring after a filtered fetch returns.
 * Used for: Avoid empty “page 5 of 2” when search/segment shrinks the result set.
 *
 * Function Index:
 * - clampPage(page, totalItems, pageSize) → safe 1-based page
 *
 * @example
 * clampPage(5, 25, 10) // → 3 (only three pages exist)
 * clampPage(2, 0, 20)  // → 1 (empty list still lands on page 1)
 *
 * Steps:
 * 1. Coerce page / size / total to safe integers.
 * 2. If there are no items, return page 1.
 * 3. Compute total pages and clamp page into [1, totalPages].
 */

import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
} from "../model/list-url-params";

/**
 * Clamp a 1-based page index so it fits within `totalItems` / `pageSize`.
 *
 * Empty result sets still resolve to page 1. Non-finite inputs fall back to
 * defaults instead of throwing.
 *
 * @param page - Requested 1-based page (may be out of range or invalid)
 * @param totalItems - Total matching rows after filters (may be 0)
 * @param pageSize - Rows per page (falls back to default size when invalid)
 * @returns A page index in `[1, totalPages]` (or `1` when total is 0)
 *
 * @example
 * ```ts
 * clampPage(9, 20, 20) // → 1
 * clampPage(2, 40, 20) // → 2
 * ```
 */
export function clampPage(
  page: number,
  totalItems: number,
  pageSize: number,
): number {
  //////////////////////////////////
  // 1. Normalize inputs — never trust raw pagination numbers from the URL.
  const safePage = Number.isFinite(page) ? Math.trunc(page) : DEFAULT_LIST_PAGE;
  const safeSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.trunc(pageSize)
      : DEFAULT_LIST_PAGE_SIZE;
  const safeTotal =
    Number.isFinite(totalItems) && totalItems > 0 ? Math.trunc(totalItems) : 0;
  //////////////////////////////////

  //////////////////////////////////
  // 2. Empty list — there is no “last page”; keep callers on page 1.
  if (safeTotal === 0) {
    return DEFAULT_LIST_PAGE;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 3. Clamp into the real page window after filters shrink (or grow) totals.
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeSize));
  if (safePage < DEFAULT_LIST_PAGE) {
    return DEFAULT_LIST_PAGE;
  }
  if (safePage > totalPages) {
    return totalPages;
  }
  return safePage;
  //////////////////////////////////
}
