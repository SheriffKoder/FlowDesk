/**
 * @file entities/customer/model/field-catalog.ts
 *
 * Purpose: Shared customer list field catalog — semantics both the entity
 *   query layer and Customer Health view configs consume.
 * Used in: `customer-list-query`, repository filter/sort, view `list-config`.
 * Used for: One place to declare field keys, domain paths, labels, and
 *   sortable / searchable / filterable capabilities so list pages stay copyable.
 *
 * Function Index:
 * - CUSTOMER_LIST_FIELDS — canonical field defs
 * - CUSTOMER_LIST_SORT_FIELDS / CUSTOMER_SEARCH_FIELD_KEYS — derived allow-lists
 * - DEFAULT_CUSTOMER_LIST_SORT_KEYS — triage default when URL omits sort
 * - getCustomerListField / getCustomerListFieldByKey — lookups
 * - customerListSortValue — comparable value for repository sort
 *
 * Steps:
 * 1. Declare each list field (URL/API key, domain path, type, capabilities).
 * 2. Derive sort / search allow-lists from those flags.
 * 3. Expose helpers so repository + views stay dumb relative to the catalog.
 *
 * See: `docs/architecture/list-field-catalog.md`
 */

import type { CustomerListItem } from "./customer";
import {
  CUSTOMER_SEGMENT_OPTIONS,
  type CustomerSegment,
} from "./segment";

/////////////////////////////////////////////////////////////
// Field types
/////////////////////////////////////////////////////////////

/** How the repository compares / how the view formats a cell. */
export type CustomerListFieldType = "string" | "number" | "isoDate" | "enum";

export type CustomerListFieldDef = {
  /** Canonical key in URL `sort=` and entity sort plans (snake where needed). */
  key: string;
  /** Property on {@link CustomerListItem}. */
  path: keyof CustomerListItem;
  /** Human label for headers / a11y (view may override). */
  label: string;
  type: CustomerListFieldType;
  sortable: boolean;
  searchable: boolean;
  filterable: boolean;
};

/////////////////////////////////////////////////////////////
// Catalog — source of truth for customer list field semantics
/////////////////////////////////////////////////////////////

/**
 * Every field the customer list domain knows about.
 * Views pick a subset via `list-config`; entity derives sort/search allow-lists.
 */
export const CUSTOMER_LIST_FIELDS = {
  name: {
    key: "name",
    path: "name",
    label: "Name",
    type: "string",
    sortable: true,
    searchable: true,
    filterable: false,
  },
  domain: {
    key: "domain",
    path: "domain",
    label: "Domain",
    type: "string",
    sortable: false,
    searchable: true,
    filterable: false,
  },
  mrr: {
    key: "mrr",
    path: "mrr",
    label: "MRR",
    type: "number",
    sortable: true,
    searchable: false,
    filterable: false,
  },
  last_active: {
    key: "last_active",
    path: "lastActive",
    label: "Last active",
    type: "isoDate",
    sortable: true,
    searchable: false,
    filterable: false,
  },
  health: {
    key: "health",
    path: "health",
    label: "Health",
    type: "number",
    sortable: true,
    searchable: false,
    filterable: false,
  },
  owner: {
    key: "owner",
    path: "owner",
    label: "Owner",
    type: "string",
    sortable: true,
    searchable: false,
    filterable: false,
  },
  segment: {
    key: "segment",
    path: "segment",
    label: "Segment",
    type: "enum",
    sortable: false,
    searchable: false,
    filterable: true,
  },
} as const satisfies Record<string, CustomerListFieldDef>;

export type CustomerListFieldId = keyof typeof CUSTOMER_LIST_FIELDS;

export type CustomerListField =
  (typeof CUSTOMER_LIST_FIELDS)[CustomerListFieldId];

/////////////////////////////////////////////////////////////
// Derived allow-lists
/////////////////////////////////////////////////////////////

type SortableFieldKey = {
  [K in CustomerListFieldId]: (typeof CUSTOMER_LIST_FIELDS)[K]["sortable"] extends true
    ? (typeof CUSTOMER_LIST_FIELDS)[K]["key"]
    : never;
}[CustomerListFieldId];

type SearchableFieldId = {
  [K in CustomerListFieldId]: (typeof CUSTOMER_LIST_FIELDS)[K]["searchable"] extends true
    ? K
    : never;
}[CustomerListFieldId];

/**
 * Sortable URL/API keys — derived from {@link CUSTOMER_LIST_FIELDS}.
 * Keep in sync by only flipping `sortable` on catalog entries.
 */
export const CUSTOMER_LIST_SORT_FIELDS = [
  CUSTOMER_LIST_FIELDS.name.key,
  CUSTOMER_LIST_FIELDS.mrr.key,
  CUSTOMER_LIST_FIELDS.last_active.key,
  CUSTOMER_LIST_FIELDS.health.key,
  CUSTOMER_LIST_FIELDS.owner.key,
] as const satisfies ReadonlyArray<SortableFieldKey>;

export type CustomerListSortField = (typeof CUSTOMER_LIST_SORT_FIELDS)[number];

/**
 * Catalog ids included in free-text search (name + domain today).
 */
export const CUSTOMER_SEARCH_FIELD_IDS = [
  "name",
  "domain",
] as const satisfies ReadonlyArray<SearchableFieldId>;

export type CustomerSearchFieldId = (typeof CUSTOMER_SEARCH_FIELD_IDS)[number];

/**
 * Default triage order when the list query uses `kind: "default"`
 * (URL omits `sort`). Health risk-first, then name A→Z.
 * Do not canonicalize into the URL on first land.
 */
export const DEFAULT_CUSTOMER_LIST_SORT_KEYS = [
  { field: CUSTOMER_LIST_FIELDS.health.key, order: "asc" as const },
  { field: CUSTOMER_LIST_FIELDS.name.key, order: "asc" as const },
] as const satisfies ReadonlyArray<{
  field: CustomerListSortField;
  order: "asc" | "desc";
}>;

/** Filter options for the segment field (entity-owned labels). */
export const CUSTOMER_LIST_SEGMENT_FILTER_OPTIONS = CUSTOMER_SEGMENT_OPTIONS;

/////////////////////////////////////////////////////////////
// Lookups + apply helpers
/////////////////////////////////////////////////////////////

const FIELDS_BY_KEY: Record<string, CustomerListField> = Object.fromEntries(
  (Object.values(CUSTOMER_LIST_FIELDS) as CustomerListField[]).map((field) => [
    field.key,
    field,
  ]),
);

/**
 * Look up a catalog entry by catalog id (`name`, `last_active`, …).
 */
export function getCustomerListField(
  id: CustomerListFieldId,
): CustomerListField {
  return CUSTOMER_LIST_FIELDS[id];
}

/**
 * Look up a catalog entry by URL/API key, or `undefined` if unknown.
 */
export function getCustomerListFieldByKey(
  key: string,
): CustomerListField | undefined {
  return FIELDS_BY_KEY[key];
}

/**
 * Comparable value for repository multi-key sort.
 */
export function customerListSortValue(
  item: CustomerListItem,
  field: CustomerListSortField,
): string | number {
  const def = getCustomerListFieldByKey(field);
  if (!def) {
    return "";
  }

  const raw = item[def.path];

  switch (def.type) {
    case "string":
      return String(raw).toLowerCase();
    case "number":
      return typeof raw === "number" ? raw : Number(raw);
    case "isoDate":
      return String(raw);
    case "enum":
      return String(raw);
  }
}

/**
 * Case-insensitive match against all {@link CUSTOMER_SEARCH_FIELD_IDS}.
 */
export function customerListMatchesSearch(
  item: CustomerListItem,
  search: string,
): boolean {
  const needle = search.trim().toLowerCase();
  if (needle === "") {
    return true;
  }

  return CUSTOMER_SEARCH_FIELD_IDS.some((id) => {
    const def = CUSTOMER_LIST_FIELDS[id];
    return String(item[def.path]).toLowerCase().includes(needle);
  });
}

/**
 * Segment label map for table cells (re-export convenience).
 */
export function customerSegmentLabel(segment: CustomerSegment): string {
  const option = CUSTOMER_SEGMENT_OPTIONS.find((entry) => entry.value === segment);
  return option?.label ?? segment;
}
