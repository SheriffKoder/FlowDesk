/**
 * @file views/customer-health/lib/serialize-list-params.ts
 *
 * Purpose: Turn typed Customer Health URL state into a stable query string.
 * Used in: Toolbar / pagination / sort / drawer controls building the next URL.
 * Used for: Shareable links that omit defaults and absent sort so first land
 *   stays clean while still round-tripping explicit filters (ADR-002).
 *
 * Function Index:
 * - serializeListParams(params, options?) → URLSearchParams
 * - serializeListParamsToString(params, options?) → query string (no leading `?`)
 *
 * @example
 * serializeListParamsToString(DEFAULT_CUSTOMER_HEALTH_URL_PARAMS) // → ""
 * serializeListParamsToString({ ...defaults, sorts: [{ field: "mrr", order: "desc" }] })
 * // → "sort=mrr:desc"
 *
 * Steps:
 * 1. Start an empty URLSearchParams.
 * 2. Write only non-default / non-null fields (unless includeDefaults).
 * 3. Write multi-level `sort=field:order,...` when sorts are present.
 */

import {
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_PAGE,
  LIST_URL_PARAM_KEYS,
  type CustomerHealthUrlParams,
} from "../model/list-url-params";

/**
 * Options for {@link serializeListParams}.
 */
export type SerializeListParamsOptions = {
  /**
   * When true, include `page` / `page_size` even when they match defaults.
   * Default false keeps first-land URLs clean (no sort / page / size noise).
   */
  includeDefaults?: boolean;
};

/**
 * Build `URLSearchParams` from typed list state.
 *
 * Omits empty search, empty segment/customerId, default page/size (unless
 * `includeDefaults`), and empty sorts so first land stays triage-default
 * without writing sort into the URL.
 */
export function serializeListParams(
  params: CustomerHealthUrlParams,
  options: SerializeListParamsOptions = {},
): URLSearchParams {
  const { includeDefaults = false } = options;
  const searchParams = new URLSearchParams();

  //////////////////////////////////
  // 1. Filters — only write when they change the “all / empty search” baseline.
  if (params.search !== "") {
    searchParams.set(LIST_URL_PARAM_KEYS.search, params.search);
  }

  if (params.segment.length > 0) {
    searchParams.set(
      LIST_URL_PARAM_KEYS.segment,
      params.segment.join(","),
    );
  }
  //////////////////////////////////

  //////////////////////////////////
  // 2. Pagination — omit page 1 / default size unless includeDefaults is set.
  if (params.page !== DEFAULT_LIST_PAGE || includeDefaults) {
    searchParams.set(LIST_URL_PARAM_KEYS.page, String(params.page));
  }

  if (
    params.pageSize !== DEFAULT_CUSTOMER_HEALTH_URL_PARAMS.pageSize ||
    includeDefaults
  ) {
    searchParams.set(LIST_URL_PARAM_KEYS.pageSize, String(params.pageSize));
  }
  //////////////////////////////////

  //////////////////////////////////
  // 3. Explicit multi-level sort — never canonicalize the health-then-name default.
  if (params.sorts.length > 0) {
    searchParams.set(
      LIST_URL_PARAM_KEYS.sort,
      params.sorts.map((spec) => `${spec.field}:${spec.order}`).join(","),
    );
  }
  //////////////////////////////////

  //////////////////////////////////
  // 4. Drawer target — omit when closed so the list URL stays shareable alone.
  if (params.customerId !== null) {
    searchParams.set(LIST_URL_PARAM_KEYS.customerId, params.customerId);
  }
  //////////////////////////////////

  return searchParams;
}

/**
 * Serialize list params to a query string without a leading `?`.
 */
export function serializeListParamsToString(
  params: CustomerHealthUrlParams,
  options?: SerializeListParamsOptions,
): string {
  return serializeListParams(params, options).toString();
}
