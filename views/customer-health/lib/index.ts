/**
 * @file views/customer-health/lib/index.ts
 *
 * Purpose: Public barrel for Customer Health URL-contract helpers.
 * Used in: `views/customer-health/index.ts` and unit tests that import via the view API.
 * Used for: Single import surface so callers do not deep-import individual helper files.
 *
 * Function Index:
 * - re-exports: clampPage, parseListParams, applyListParamsPatch,
 *   serializeListParams, serializeListParamsToString, resolveListSort,
 *   nextListSort, listSortDirectionForColumn, listSortLevelForColumn,
 *   listSortAriaForColumn
 * - types: RawSearchParams, ListParamsPatch, SerializeListParamsOptions
 *
 * Steps:
 * 1. Re-export parse / serialize helpers.
 * 2. Re-export page reset + clamp helpers.
 * 3. Re-export sort resolution + header toggle cycle (append levels).
 */

export { clampPage } from "./clamp-page";
export { parseListParams, type RawSearchParams } from "./parse-list-params";
export { applyListParamsPatch, type ListParamsPatch } from "./reset-page";
export {
  serializeListParams,
  serializeListParamsToString,
  type SerializeListParamsOptions,
} from "./serialize-list-params";
export { resolveListSort } from "./resolve-list-sort";
export { toEntityListSort } from "./to-entity-list-sort";
export {
  listSortAriaForColumn,
  listSortDirectionForColumn,
  listSortLevelForColumn,
  nextListSort,
} from "./next-list-sort";
