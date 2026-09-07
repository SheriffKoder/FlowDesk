# Rendering

## Default

- **Server Components first** for the Customer Health route (`page.tsx`).
- Introduce `"use client"` only at interactive islands (toolbar, sort controls, details panel / list shell, prefetch button, app sidebar).
- Root layout wraps pages in `AppShell` (`widgets/app-sidebar`); slim icon rail on desktop, bottom dock on mobile.

## Route composition

```
page.tsx (Server)
  └─ loadCustomerList(searchParams)  ← views/customer-health/server
       └─ CustomerHealthPage
            ├─ PageHeader              ← server OK (view-local until shared page-header)
            └─ CustomerListShell       ← client (list URL + details panel)
                 ├─ toolbar / table / pagination
                 └─ CustomerDetailsPanel → shared DetailsPanel (in-layout)
```

List presentation is the dumb shared `DataTable` (`shared/ui/table`): `columns`, `data`, `getRowId`, optional `onRowClick` / `selectedRowId` / `isPending`. Domain column config stays in the view.

First paint loads rows via `loadCustomerList` (entity `listCustomers`); fixtures stay behind the repository.

## Loading model

| Moment | UI |
|---|---|
| First route paint / hard navigation | `loading.tsx` (table-density skeletons) |
| Same-route param change (search, segment, page, sort) | Keep rows; dim via `useTransition` `isPending`; `{ scroll: false }` |
| Drawer open (cold) | Panel-local loading / skeleton sections (in-layout details panel) |
| Drawer open (warm prefetch) | Body paints from client cache |

Respect `prefers-reduced-motion` when dim/transition animations are used.

## Errors

- Route: `error.tsx` + reset.
- Drawer: local error + retry (does not replace the whole page); prefer offline vs server copy when detectable.
- Empty list: distinguish **no customers** vs **no matches for filters/search**.
- Invalid URL params: coerce to defaults; page clamp when out of range.

## Table presentation

- Long names: truncate + tooltip.
- Missing cells (MRR / owner / last active): em dash, not blank shift.
- Narrow viewports: horizontal table scroll; open details panel may fill the workspace (list column hidden).

## Boundaries

- `loading.tsx` / `error.tsx` / `not-found.tsx` at the route.
- Prefer Suspense only when streaming a distinct slow subtree; do not blank the table on every filter change.
