# View — Customer Health

Route composition for the Customer Health overview page.

**Owns:** page shell wiring (header, toolbar, table, drawer host), view-local URL contract helpers (`lib/` + `model/list-url-params.ts`), and server list load (`server/load-customer-list.ts`).

**Does not own:** customer domain schemas, API handlers, or shared UI primitives (migrate header/table/panel into `shared/ui` as those tickets land).

## Composition

```
page.tsx (Server)
  └─ loadCustomerList(searchParams)
       └─ CustomerHealthPage
            ├─ PageHeader                 ← server (view-local for now)
            ├─ CustomerHealthToolbar      ← client island
            ├─ CustomerTable              ← view wiring → shared DataTable
            └─ CustomerDrawerHost         ← client island (viewport-edge slot)
```

`CustomerTable` owns column config and list props; `shared/ui` `DataTable` stays dumb (columns, data, onRowClick, selection).

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
| `applyListParamsPatch` | reset `page` → 1 when search/segment/sort/size change |
| `clampPage` | clamp page when totals shrink |

Unit coverage: `tests/unit/list-url-params.test.ts`.

Dependency direction: `views → features → entities → shared`.
