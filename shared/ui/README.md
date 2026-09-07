# Shared UI

Cross-domain presentational primitives (no business logic).

| Component | Role |
|---|---|
| `DataTable` (`table/`) | Configurable table: `columns`, `data`, `getRowId`, optional `onRowClick` / `selectedRowId` / `isPending` |
| `page-header` | Title + supporting paragraph *(later)* |
| `pagination-*` | Footer, page size, navigation *(later)* |
| Search input | Param label, placeholder, debounce *(later)* |
| Filter control | Button + dropdown *(later)* |
| Sort control | Header-cell island *(later)* |
| Panel / drawer shell | Children slot; a11y focus trap *(later)* |

Import via `@/shared/ui` (or `@/shared`) — no deep imports across slices.
