# Lib — Customer Health URL helpers

**Purpose:** Parse, serialize, and derive list/drawer URL state for `/customers/health`.

**Used in:** `server/load-customer-list.ts`, `app/api/customers`, toolbar / pagination / sort islands, drawer host, `tests/unit/list-url-params.test.ts`.

**Used for:** Keep one typed contract for `searchParams` so UI and API share the same defaults, page-reset, and health-then-name sort rules (ADR-002).

## Files

| File | Responsibility |
|---|---|
| `parse-list-params.ts` | Raw `searchParams` → `CustomerHealthUrlParams` |
| `serialize-list-params.ts` | Typed params → `URLSearchParams` / query string |
| `resolve-list-sort.ts` | Absent sort → default health (risk-first) then name |
| `to-entity-list-sort.ts` | View resolved sort → entity `listCustomers` sort |
| `reset-page.ts` | Patch merge + reset `page` → 1 on filter/sort/size change |
| `clamp-page.ts` | Clamp `page` when totals shrink |
| `index.ts` | Public barrel for this folder |

Param names, enums, and defaults live in `../model/list-url-params.ts`.

## Steps (typical call path)

1. **Server page** — `loadCustomerList(searchParams)` (parse → resolve → `toEntityListSort` → `listCustomers`).
2. **Client controls** — `applyListParamsPatch` → `serializeListParams` → `router` / `<Link>` with `{ scroll: false }`.
3. **After list fetch** — page clamp already happens inside `listCustomers`; `clampPage` remains for client-side guards.

## Rules

- Pure functions only (no fetch, no hooks).
- One primary export per file (barrel re-exports types + helpers).
- Invalid URL values coerce to safe defaults; do not throw.

## Why not `shared/lib`?

This contract is **Customer Health–specific**, not a generic URL utility. It encodes domain rules: `segment` (`healthy` / `watch` / `at_risk`), `customerId` for the drawer, health-then-name default sort, and which fields reset `page`. That belongs with the view that owns `/customers/health`.

`shared/lib` stays for reusable primitives (`cn`, debounce, generic query helpers). If a second list route needs the **same** param shape and rules, lift the pure pieces then — until then, keep this dialect out of `shared/` so other features are not coupled to it.
