# Shared UI — SearchInput

Dumb search field: local draft while typing, debounced (or Enter) commit, rehydrate from committed `value` (usually URL).

No router knowledge — callers pass `value` + `onValueCommit`.

## Behavior

```
type → draft (local, immediate; never overwritten by our own URL echo)
  └─ wait debounceMs (default 300) or Enter
       └─ onValueCommit(trimmed draft)  ← remember as lastCommitted
            └─ parent patches URL ({ scroll: false })
                 └─ value prop updates → ignored if it matches lastCommitted
```

Back/forward: URL `value` differs from `lastCommitted` → draft rehydrates.

Soft-nav while still typing: draft stays; a later debounce pushes the fuller string.

## Usage

```tsx
<SearchInput
  label="Search"
  placeholder="Search by name or domain"
  value={params.search}
  debounceMs={300}
  onValueCommit={(search) => patchParams({ search })}
/>
```
