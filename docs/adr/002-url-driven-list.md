# ADR-002: URL as list source of truth

## Status

Accepted

## Context

CSMs need shareable filtered views (segment, search, page). The list must support server-side pagination for large datasets.

## Decision

- List state lives in the URL: `search`, `segment`, `page`, `page_size`, `sort` (multi-level `field:order,...`).
- Reset `page` to `1` when search, segment, sort, or page size change; clamp `page` when the result set shrinks.
- When `sort` is absent, resolve default **health (risk-first) then name** in parse/query — do not require that param on first land.
- Explicit sorts **append levels** (clicking another column adds a secondary/tertiary key); cycling a key: none → asc → desc → remove.
- Debounce search input; rehydrate local search from URL on back/forward if debounce never committed.
- Push URL updates with `{ scroll: false }` inside `startTransition`.
- Dim the table while `isPending` (keep rows visible; optional `pointer-events-none`).
- Invalid list params coerce to safe defaults.

## Consequences

- Refresh and share restore the same list view.
- First land is triage-ordered without sort params in the URL.
- No client row cache required in this phase.
- API handlers must honor the same query contract (including default sort when omitted).
