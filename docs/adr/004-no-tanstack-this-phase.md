# ADR-004: No TanStack Query this phase

## Status

Accepted

## Context

The page is read-heavy. List interactivity is URL + RSC. Drawer needs a small client cache, not a full query library yet.

## Decision

- Do not add TanStack Query, SWR, or a global client store (Zustand/Redux) in this implementation phase.
- List: built-in `fetch` + Server Components + URL `searchParams`.
- Drawer: simple client fetch + in-memory cache (module Map or small hook cache).
- Revisit TanStack if list transitions feel slow or mutations appear.

## Consequences

- Smaller dependency surface and clearer teaching story (RSC + URL).
- Prefetch/cache logic is hand-rolled and must stay tiny and well-documented.
- Later adoption can hydrate from RSC payloads if needed.
