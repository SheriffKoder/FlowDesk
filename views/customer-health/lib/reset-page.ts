/**
 * @file views/customer-health/lib/reset-page.ts
 *
 * Purpose: Merge URL param patches and reset pagination when filters change.
 * Used in: Toolbar, segment filter, sort headers, page-size control (client).
 * Used for: Enforce “change search/segment/sort/page_size → page = 1” so CSMs
 *   never stay on a stale deep page after narrowing the list (ADR-002).
 *
 * Function Index:
 * - fieldChanged — private equality check for a page-reset field
 * - applyListParamsPatch(current, patch) → next CustomerHealthUrlParams
 *
 * Steps:
 * 1. Shallow-merge current params with the patch (canonicalize segments/sorts).
 * 2. Detect whether any PAGE_RESET_FIELDS value changed.
 * 3. If so, force page back to 1; otherwise keep the requested page.
 */

import {
  DEFAULT_LIST_PAGE,
  PAGE_RESET_FIELDS,
  canonicalizeSegments,
  canonicalizeSorts,
  segmentsEqual,
  sortsEqual,
  type CustomerHealthUrlParams,
  type PageResetField,
} from "../model/list-url-params";

/**
 * Partial update applied on top of current list URL state.
 * `page` is optional so callers can navigate pages without resetting filters.
 */
export type ListParamsPatch = Partial<
  Omit<CustomerHealthUrlParams, "page">
> & {
  page?: number;
};

/**
 * Return whether a page-reset field differs between current and next state.
 */
function fieldChanged(
  current: CustomerHealthUrlParams,
  next: CustomerHealthUrlParams,
  field: PageResetField,
): boolean {
  if (field === "segment") {
    return !segmentsEqual(current.segment, next.segment);
  }
  if (field === "sorts") {
    return !sortsEqual(current.sorts, next.sorts);
  }
  return current[field] !== next[field];
}

/**
 * Merge a patch into current list params, resetting `page` when filters change.
 *
 * Changing search, segment, sorts, or pageSize forces `page` to 1.
 * Patches that only touch `page` or `customerId` keep the requested page.
 */
export function applyListParamsPatch(
  current: CustomerHealthUrlParams,
  patch: ListParamsPatch,
): CustomerHealthUrlParams {
  //////////////////////////////////
  // 1. Merge — patch wins; canonicalize segment + multi-level sorts.
  const next: CustomerHealthUrlParams = {
    ...current,
    ...patch,
  };

  if (patch.segment !== undefined) {
    next.segment = canonicalizeSegments(patch.segment);
  }

  if (patch.sorts !== undefined) {
    next.sorts = canonicalizeSorts(patch.sorts);
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Detect filter/sort/size changes that invalidate the current page index.
  const shouldResetPage = PAGE_RESET_FIELDS.some((field) =>
    fieldChanged(current, next, field),
  );
  //////////////////////////////////

  //////////////////////////////////
  // 3. Reset pagination when the result window is no longer the same query.
  if (shouldResetPage) {
    next.page = DEFAULT_LIST_PAGE;
  }
  //////////////////////////////////

  return next;
}
