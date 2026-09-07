/**
 * @file Public exports for the Customer Health view.
 */

export { CustomerHealthPage } from "./ui/customer-health-page";

export {
  applyListParamsPatch,
  clampPage,
  listSortAriaForColumn,
  listSortDirectionForColumn,
  listSortLevelForColumn,
  nextListSort,
  parseListParams,
  resolveListSort,
  serializeListParams,
  serializeListParamsToString,
  toEntityListSort,
  type ListParamsPatch,
  type RawSearchParams,
  type SerializeListParamsOptions,
} from "./lib";

export {
  loadCustomerList,
  type CustomerListEmptyKind,
  type CustomerListPageData,
} from "./server/load-customer-list";

export {
  CUSTOMER_SEGMENTS,
  DEFAULT_CUSTOMER_HEALTH_URL_PARAMS,
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  DEFAULT_LIST_SORT,
  LIST_PAGE_SIZES,
  LIST_SORT_KEYS,
  LIST_SORT_ORDERS,
  LIST_URL_PARAM_KEYS,
  PAGE_RESET_FIELDS,
  canonicalizeSegments,
  canonicalizeSorts,
  segmentsEqual,
  sortsEqual,
  type CustomerHealthUrlParams,
  type CustomerSegment,
  type DefaultListSort,
  type ExplicitListSort,
  type ListPageSize,
  type ListSortKey,
  type ListSortOrder,
  type ListSortSpec,
  type ListUrlParamKey,
  type PageResetField,
  type ResolvedListSort,
} from "./model/list-url-params";

export {
  customerHealthListConfig,
  type CustomerHealthCellFormat,
  type CustomerHealthColumnConfig,
  type CustomerHealthListConfig,
} from "./model/list-config";
