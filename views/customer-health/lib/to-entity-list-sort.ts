/**
 * @file views/customer-health/lib/to-entity-list-sort.ts
 *
 * Purpose: Map view ResolvedListSort → entity CustomerListSort.
 * Used in: server/load-customer-list, GET /api/customers route adapter.
 * Used for: Keep URL-contract sort dialect and entity query input aligned
 *   without duplicating the kind/keys mapping.
 *
 * Function Index:
 * - toEntityListSort(resolved) → CustomerListSort
 *
 * Steps:
 * 1. Default multi-key plan → `{ kind: "default" }` (entity applies health-then-name).
 * 2. Explicit multi-level → `{ kind: "explicit", keys }`.
 */

import type { CustomerListSort } from "@/entities/customer";

import type { ResolvedListSort } from "../model/list-url-params";

/**
 * Convert a view-resolved sort plan into the entity list-query sort input.
 *
 * @param resolved - Output of `resolveListSort`
 * @returns Entity `CustomerListSort` for `listCustomers`
 */
export function toEntityListSort(resolved: ResolvedListSort): CustomerListSort {
  //////////////////////////////////
  // 1. Absent URL sort → entity default (health-then-name inside repository).
  if (resolved.kind === "default") {
    return { kind: "default" };
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Explicit multi-level sort — fields/orders already validated.
  return {
    kind: "explicit",
    keys: resolved.keys.map((spec) => ({
      field: spec.field,
      order: spec.order,
    })),
  };
  //////////////////////////////////
}
