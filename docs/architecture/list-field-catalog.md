# List field catalog + page list config

How Customer Health (and future list pages) stay **copyable**: change the API loader and configs, keep shared UI and URL helpers dumb.

## Problem

Sort keys, search fields, filters, columns, and pagination were scattered across:

- view URL constants (`list-url-params`)
- column builders (`customer-table-columns`)
- entity query types (`customer-list-query`)
- repository compare/search switches

Cloning the page meant hunting every allow-list by hand.

## Split

Two configs, clear ownership:

```text
entities/<domain>/model/field-catalog.ts     ← domain semantics
views/<page>/model/list-config.ts            ← page composition
views/<page>/model/list-url-params.ts        ← typed URL state (derived)
```

| Layer | Owns | Does not own |
|---|---|---|
| **Entity field catalog** | Field keys, domain paths, labels, types, sortable / searchable / filterable, default triage sort keys, enum filter options | URL param *names*, page sizes, column order, cell format choice, JSX |
| **View list config** | Which catalog fields appear, URL dialect, filters on this page, pagination sizes, column formats | Field semantics, repository compare logic |

Dependency direction stays:

```text
views → entities → shared
```

Entity never imports the view config. The view **references** catalog ids/keys.

## Entity catalog (`entities/customer/model/field-catalog.ts`)

Declares every list field the domain knows about, e.g. `name`, `domain`, `mrr`, `last_active`, `health`, `owner`, `segment`.

Derived from flags:

- `CUSTOMER_LIST_SORT_FIELDS` — `sortable: true`
- `CUSTOMER_SEARCH_FIELD_IDS` — `searchable: true`
- `DEFAULT_CUSTOMER_LIST_SORT_KEYS` — triage when URL omits `sort`

Helpers used by the repository:

- `customerListSortValue` — comparable value by field type
- `customerListMatchesSearch` — searches catalog searchable paths

Changing “what can be sorted/searched” is a catalog edit; repository stays dumb.

## View list config (`views/customer-health/model/list-config.ts`)

`customerHealthListConfig` composes the page:

- `params` — query string key names (`page_size`, `sort`, …)
- `search` / `filters` / `pagination` / `sort` — controls + defaults
- `columns` — ordered columns: `fieldId` → catalog, `format` → view formatter registry

`list-url-params.ts` **derives** `LIST_URL_PARAM_KEYS`, `LIST_SORT_KEYS`, `LIST_PAGE_SIZES`, `DEFAULT_LIST_SORT`, `PAGE_RESET_FIELDS` from that config (sort keys still come from the entity catalog via `sort.allowed`).

`buildCustomerTableColumns` maps `config.columns` → labels from the catalog + formatters in the view.

## Copy checklist (new list page)

1. **Copy** `views/customer-health` → `views/<new-page>`.
2. **Entity** — reuse `entities/customer` or add `entities/<domain>/model/field-catalog.ts` + query/repository.
3. **Edit** `list-config.ts` — columns, filters, params, page sizes, default sort subset.
4. **Swap** server loader + `app/api/...` route to the new query.
5. **Leave** `shared/ui` (`DataTable`, `SortButton`, `SearchInput`, `Pagination`) and dumb parse/serialize cycle helpers unless a second page needs a shared list-url kit.

## What stays out of the catalog

- URL param names (`page_size` vs `pageSize`)
- Debounce ms, page size options
- Cell format ids (`currencyUsd`) and JSX
- Drawer open param (`customerId`)

Those are page product / presentation decisions.

## Related

- [routing.md](./routing.md) — URL contract surface
- [state-management.md](./state-management.md) — URL as list source of truth
- [../adr/002-url-driven-list.md](../adr/002-url-driven-list.md)
- Entity skim: [`entities/customer/docs/responsibilities.md`](../../entities/customer/docs/responsibilities.md)
