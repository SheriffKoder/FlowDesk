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
 * @example
 * applyListParamsPatch(
 *   { ...defaults, page: 5, search: "a" },
 *   { search: "b" },
 * )
 * // → page forced to 1
 *
 * Steps:
 * 1. Shallow-merge current params with the patch.
 * 2. Detect whether any PAGE_RESET_FIELDS value changed.
 * 3. If so, force page back to 1; otherwise keep the requested page.
 */

import {
  DEFAULT_LIST_PAGE,
  PAGE_RESET_FIELDS,
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
 *
 * @param current - Params before the patch
 * @param next - Params after the shallow merge
 * @param field - One of search | segment | pageSize | sort | order
 * @returns True when that field’s value changed
 */
function fieldChanged(
  current: CustomerHealthUrlParams,
  next: CustomerHealthUrlParams,
  field: PageResetField,
): boolean {
  return current[field] !== next[field];
}

/**
 * Merge a patch into current list params, resetting `page` when filters change.
 *
 * Changing search, segment, sort, order, or pageSize forces `page` to 1.
 * Patches that only touch `page` or `customerId` keep the requested page.
 *
 * @param current - Parsed params currently reflected in the URL
 * @param patch - Fields the control wants to update
 * @returns Next typed params ready for `serializeListParams`
 *
 * @example
 * ```ts
 * applyListParamsPatch(params({ page: 5 }), { pageSize: 50 }).page // → 1
 * applyListParamsPatch(params({ page: 5 }), { page: 3 }).page // → 3
 * ```
 */
export function applyListParamsPatch(
  current: CustomerHealthUrlParams,
  patch: ListParamsPatch,
): CustomerHealthUrlParams {
  //////////////////////////////////
  // 1. Merge — patch wins for provided keys; untouched fields stay as-is.
  const next: CustomerHealthUrlParams = {
    ...current,
    ...patch,
  };
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
