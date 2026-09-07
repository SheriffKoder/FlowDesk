# Shared UI — Pagination

Dumb list footer: range copy, page size, and prev/next. No router or URL knowledge — callers pass page meta and change handlers.

## Layout

```
Pagination                          ← <nav> shell (pending dim + aria-busy)
├── PaginationSummary               ← mobile “1–20 of 40” / desktop “Showing …”
└── PaginationControls              ← right cluster
    ├── PaginationPageSizeSelect    ← dropdown (Rows label on md+)
    └── PaginationNav               ← mobile [<] 1/2 [>] / desktop Previous … Next
```

**Mobile**

```
1–20 of 40          [20 ▾]  [<] 1/2 [>]
```

**Desktop**

```
Showing 1–20 of 40   Rows [20 ▾]  [Previous] Page 1 of 2 [Next]
```

## Files

| File | Role |
|---|---|
| `pagination.tsx` | Composition shell |
| `pagination-summary.tsx` | Range label |
| `pagination-controls.tsx` | Right-side cluster |
| `pagination-page-size-select.tsx` | Page size DropdownMenu (`components/ui/dropdown-menu`) |
| `pagination-nav.tsx` | Prev / status / Next |
| `pagination-range.ts` | Pure `getPaginationRange` math |
| `types.ts` | Public `PaginationProps` |

## Usage

```tsx
<Pagination
  page={page}
  pageSize={pageSize}
  total={total}
  pageSizeOptions={[10, 20, 50]}
  isPending={isPending}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

Public export: `Pagination` (+ `getPaginationRange` for tests). Subcomponents stay internal unless a view needs to recompose the footer.
