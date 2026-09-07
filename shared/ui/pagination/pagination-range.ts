/**
 * @file shared/ui/pagination/pagination-range.ts
 *
 * Purpose: Pure range math for the pagination footer label + nav bounds.
 * Used in: `Pagination` UI; optional unit tests.
 * Used for: Keep “Showing X–Y of Z” / total-pages logic out of the component.
 *
 * Function Index:
 * - getPaginationRange(page, pageSize, total) → { start, end, totalPages }
 */

export type PaginationRange = {
  /** 1-based first row index on this page (0 when empty). */
  start: number;
  /** 1-based last row index on this page (0 when empty). */
  end: number;
  /** At least 1 so Prev/Next stay well-defined on empty lists. */
  totalPages: number;
};

/**
 * Derive display range and page count from list meta.
 *
 * @example
 * getPaginationRange(2, 10, 22) // → { start: 11, end: 20, totalPages: 3 }
 */
export function getPaginationRange(
  page: number,
  pageSize: number,
  total: number,
): PaginationRange {
  //////////////////////////////////
  // 1. Empty result set — no rows to show; keep a single logical page.
  if (total <= 0 || pageSize <= 0) {
    return { start: 0, end: 0, totalPages: 1 };
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Page window within [1, total].
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Math.trunc(page)), totalPages);
  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return { start, end, totalPages };
  //////////////////////////////////
}
