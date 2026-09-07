# View — Customer Health

Route composition for the Customer Health overview page.

**Owns:** page shell wiring (header, toolbar, table, drawer host) and view-local URL helpers once implemented.

**Does not own:** customer domain schemas, API handlers, or shared UI primitives (migrate header/table/panel into `shared/ui` as those tickets land).

## Composition (Foundation ticket 2)

```
CustomerHealthPage (server)
  ├─ PageHeader                 ← server (view-local for now)
  ├─ CustomerHealthToolbar      ← client island
  ├─ CustomerTable              ← view wiring → shared DataTable
  └─ CustomerDrawerHost         ← client island (viewport-edge slot)
```

`CustomerTable` owns column config and list props; `shared/ui` `DataTable` stays dumb (columns, data, onRowClick, selection).

Dependency direction: `views → features → entities → shared`.
