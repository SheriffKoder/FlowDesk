# View — Customer Health

Route composition for the Customer Health overview page.

**Owns:** page shell wiring (header, toolbar, table, drawer host), view-local URL contract helpers (`lib/` + `model/list-config.ts` / `list-url-params.ts`), and server list load (`server/load-customer-list.ts`).

**Does not own:** customer domain schemas / field catalog, API handlers, or shared UI primitives.

Copyable list pattern: [docs/architecture/list-field-catalog.md](../../docs/architecture/list-field-catalog.md).

## Composition

```
page.tsx (Server)
  └─ loadCustomerList(searchParams)
       └─ CustomerHealthPage
            ├─ PageHeader                 ← server (view-local for now)
            ├─ CustomerListShell          ← client island
            │    ├─ CustomerHealthToolbar ← SearchInput + segment FilterOptionButtons
            │    ├─ CustomerTable         ← SortButton headers → shared DataTable
            │    └─ Pagination            ← page / page_size
            └─ CustomerDrawerHost         ← client island (viewport-edge slot)
```

`CustomerTable` owns column config and list props; `shared/ui` `DataTable` stays dumb (columns, data, onRowClick, selection, `aria-sort`).

Search uses shared `SearchInput` (debounce + rehydrate from URL). Segment uses shared `FilterOptionButtons` (multi-select chips → comma-joined `segment`). Sortable headers use shared `SortButton` (none → asc → desc → remove; **append** levels → `sort=mrr:desc,name:asc`). `applyListParamsPatch` resets `page` → 1; filtered empty copy when nothing matches. Absent sort params keep triage order (health-then-name) without lighting header arrows.

## Server list (Step 5)

[`server/load-customer-list.ts`](./server/load-customer-list.ts) maps `searchParams` → entity `listCustomers` → table props. Fixtures stay behind the entity repository (no view import of seed data; no self-HTTP).

Integration 3: `tests/integration/customer-list-page.test.ts`.

## URL contract (Foundation ticket 3)

Pure helpers under [`lib/`](./lib/README.md):

| Helper | Role |
|---|---|
| `parseListParams` | `searchParams` → typed list + `customerId` |
| `serializeListParams` | typed state → query string (omits defaults / absent sort) |
| `resolveListSort` | absent sort → health (risk-first) then name |
| `toEntityListSort` | view sort → entity query sort |
| `nextListSort` | header toggle / append → next `sorts[]` |
| `applyListParamsPatch` | reset `page` → 1 when search/segment/sort/size change |
| `clampPage` | clamp page when totals shrink |

Unit coverage: `tests/unit/list-url-params.test.ts`.

Dependency direction: `views → features → entities → shared`.
