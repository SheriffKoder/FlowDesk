# Shared UI — Pagination

Dumb list footer: range copy, page size, and prev/next. No router or URL knowledge — callers pass page meta and change handlers.

## Layout

```
Pagination                          ← <nav> shell (pending dim + aria-busy)
├── PaginationSummary               ← “Showing 1–20 of 22”
└── PaginationControls              ← right cluster (wraps on narrow viewports)
    ├── PaginationPageSizeSelect    ← “Rows” DropdownMenu (radio sizes)
    └── PaginationNav               ← Previous | Page N of M | Next
```

```
┌─ Pagination ─────────────────────────────────────────────────────────┐
│  PaginationSummary              PaginationControls                   │
│  Showing 1–20 of 22             [Rows ▾]  [Previous] Page 1 of 3 [Next] │
└──────────────────────────────────────────────────────────────────────┘
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
