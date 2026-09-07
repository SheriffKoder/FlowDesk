# Shared UI

Cross-domain presentational primitives (no business logic).

| Component | Role |
|---|---|
| `DataTable` (`table/`) | Configurable table: `columns`, `data`, `getRowId`, optional `onRowClick` / `selectedRowId` / `isPending` |
| `page-header` | Title + supporting paragraph *(later)* |
| `Pagination` (`pagination/`) | Footer, page size DropdownMenu, prev/next |
| `SearchInput` (`search-input/`) | Label, placeholder, debounce + URL rehydrate |
| `FilterOptionButtons` (`filter-option-buttons/`) | Config-driven multi/single toggle button row |
| `SortButton` (`sort-button/`) | Dual filled-triangle header sort toggle (dumb) |
| `DetailsPanel` (`details-panel/`) | In-layout side panel: title, close, focus trap, Escape (not overlay) |

Import via `@/shared/ui` (or `@/shared`) — no deep imports across slices.
