# Shared UI

Cross-domain presentational primitives (no business logic).

| Component | Role |
|---|---|
| `DataTable` (`table/`) | Configurable table: `columns`, `data`, `getRowId`, optional `onRowClick` / `selectedRowId` / `isPending` |
| `page-header` | Title + supporting paragraph *(later)* |
| `Pagination` (`pagination/`) | Footer, page size DropdownMenu, prev/next |
| `SearchInput` (`search-input/`) | Label, placeholder, debounce + URL rehydrate |
| `FilterOptionButtons` (`filter-option-buttons/`) | Config-driven multi/single toggle button row |
| `SortButton` (`sort-button/`) | Dual-arrow header sort toggle (dumb) |
| Panel / drawer shell | Children slot; a11y focus trap *(later)* |

Import via `@/shared/ui` (or `@/shared`) — no deep imports across slices.
