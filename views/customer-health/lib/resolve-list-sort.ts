/**
 * @file views/customer-health/lib/resolve-list-sort.ts
 *
 * Purpose: Turn optional URL sorts into a query-ready sort plan.
 * Used in: Server list query / API adapter after `parseListParams`.
 * Used for: Apply triage default (health risk-first, then name) when the URL
 *   omits sort — without writing those params on first land (ADR-002).
 *
 * Function Index:
 * - resolveListSort({ sorts }) → ResolvedListSort
 *
 * @example
 * resolveListSort({ sorts: [] })
 * // → { kind: "default", keys: [{ field: "health", order: "asc" }, ...] }
 *
 * resolveListSort({ sorts: [{ field: "mrr", order: "desc" }, { field: "name", order: "asc" }] })
 * // → { kind: "explicit", keys: [...] }
 *
 * Steps:
 * 1. If sorts are empty, return the locked default multi-key sort.
 * 2. Otherwise return an explicit multi-level plan.
 */

import {
  DEFAULT_LIST_SORT,
  type CustomerHealthUrlParams,
  type ExplicitListSort,
  type ResolvedListSort,
} from "../model/list-url-params";

/**
 * Resolve the list sort used by the customers query.
 *
 * Absent URL `sort` → health (risk-first / ascending score) then name A→Z.
 * Explicit multi-level `sorts` win as written (priority order preserved).
 */
export function resolveListSort(
  params: Pick<CustomerHealthUrlParams, "sorts">,
): ResolvedListSort {
  //////////////////////////////////
  // 1. No explicit sort in the URL — triage-first default for the list query.
  if (params.sorts.length === 0) {
    return DEFAULT_LIST_SORT;
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Explicit multi-level sort — keys already validated by parse.
  const explicit: ExplicitListSort = {
    kind: "explicit",
    keys: params.sorts.map((spec) => ({
      field: spec.field,
      order: spec.order,
    })),
  };
  return explicit;
  //////////////////////////////////
}
