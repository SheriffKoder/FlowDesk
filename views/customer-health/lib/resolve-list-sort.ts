/**
 * @file views/customer-health/lib/resolve-list-sort.ts
 *
 * Purpose: Turn optional URL sort/order into a query-ready sort plan.
 * Used in: Server list query / API adapter after `parseListParams`.
 * Used for: Apply triage default (health risk-first, then name) when the URL
 *   omits sort — without writing those params on first land (ADR-002).
 *
 * Function Index:
 * - resolveListSort({ sort, order }) → ResolvedListSort
 *
 * @example
 * resolveListSort({ sort: null, order: null })
 * // → { kind: "default", keys: [{ field: "health", order: "asc" }, ...] }
 *
 * resolveListSort({ sort: "mrr", order: null })
 * // → { kind: "explicit", field: "mrr", order: "asc" }
 *
 * Steps:
 * 1. If sort is absent, return the locked default multi-key sort.
 * 2. Otherwise build an explicit sort; default missing order to `asc`.
 */

import {
  DEFAULT_LIST_SORT,
  type CustomerHealthUrlParams,
  type ExplicitListSort,
  type ListSortOrder,
  type ResolvedListSort,
} from "../model/list-url-params";

/**
 * Resolve the list sort used by the customers query.
 *
 * Absent URL `sort` → health (risk-first / ascending score) then name A→Z.
 * Explicit `sort` wins; missing `order` with a valid `sort` defaults to `asc`.
 *
 * @param params - Parsed `sort` / `order` (null means absent or invalid)
 * @returns Default multi-key sort or a single explicit column sort
 *
 * @example
 * ```ts
 * resolveListSort({ sort: "owner", order: "desc" })
 * // → { kind: "explicit", field: "owner", order: "desc" }
 * ```
 */
export function resolveListSort(
  params: Pick<CustomerHealthUrlParams, "sort" | "order">,
): ResolvedListSort {
  //////////////////////////////////
  // 1. No explicit sort in the URL — triage-first default for the list query.
  if (params.sort === null) {
    return DEFAULT_LIST_SORT;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Explicit column sort — pair with order (asc when the URL omitted it).
  const order: ListSortOrder = params.order ?? "asc";
  const explicit: ExplicitListSort = {
    kind: "explicit",
    field: params.sort,
    order,
  };
  return explicit;
  //////////////////////////////////
}
