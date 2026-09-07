/**
 * @file views/customer-health/lib/next-list-sort.ts
 *
 * Purpose: Pure cycle for multi-level URL sort toggles (append levels).
 * Used in: Customer table header SortButton handlers.
 * Used for: none → asc → desc → remove per key; new keys append (url-kit).
 *
 * Function Index:
 * - nextListSort(currentSorts, clicked) → next sorts[]
 * - listSortDirectionForColumn(sorts, column) → asc | desc | null
 * - listSortLevelForColumn(sorts, column) → 0-based priority | null
 * - listSortAriaForColumn(sorts, column) → aria-sort value
 *
 * Steps:
 * 1. Key absent → append `{ field, order: "asc" }` at end.
 * 2. Key asc → flip to desc (same priority).
 * 3. Key desc → remove from the list.
 */

import type { TableAriaSort } from "@/shared/ui";

import type {
  ListSortKey,
  ListSortOrder,
  ListSortSpec,
} from "../model/list-url-params";

/**
 * Next multi-level sorts after clicking a sortable column header.
 *
 * Cycle matches url-kit SortButton: none → asc → desc → remove.
 * Clicking a different column **appends** a new level (does not replace).
 */
export function nextListSort(
  currentSorts: readonly ListSortSpec[],
  clicked: ListSortKey,
): ListSortSpec[] {
  const existing = currentSorts.find((spec) => spec.field === clicked);

  //////////////////////////////////
  // 1. New column — append as next priority level, ascending.
  if (!existing) {
    return [...currentSorts, { field: clicked, order: "asc" }];
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Asc → desc (keep priority).
  if (existing.order === "asc") {
    return currentSorts.map((spec) =>
      spec.field === clicked ? { ...spec, order: "desc" } : spec,
    );
  }
  //////////////////////////////////

  //////////////////////////////////
  // 3. Desc → remove; empty list → triage default via serialize omit.
  return currentSorts.filter((spec) => spec.field !== clicked);
  //////////////////////////////////
}

/**
 * Active arrow direction for a column header.
 * Absent from URL sorts → null (do not light arrows for the implicit default).
 */
export function listSortDirectionForColumn(
  sorts: readonly ListSortSpec[],
  column: ListSortKey,
): ListSortOrder | null {
  const match = sorts.find((spec) => spec.field === column);
  return match?.order ?? null;
}

/**
 * 0-based priority level for a column in the multi-level sort list.
 */
export function listSortLevelForColumn(
  sorts: readonly ListSortSpec[],
  column: ListSortKey,
): number | null {
  const index = sorts.findIndex((spec) => spec.field === column);
  return index >= 0 ? index : null;
}

/**
 * `aria-sort` for a sortable column; `none` when not in the active URL sorts.
 */
export function listSortAriaForColumn(
  sorts: readonly ListSortSpec[],
  column: ListSortKey,
): TableAriaSort {
  const direction = listSortDirectionForColumn(sorts, column);
  if (direction === "asc") {
    return "ascending";
  }
  if (direction === "desc") {
    return "descending";
  }
  return "none";
}
