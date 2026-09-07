# ADR-006: List server cache vs drawer client cache

## Status

Accepted

## Context

Fast drawer open needs reuse in the tab. The table needs correct, shareable server pages.

## Decision

- Table: server-driven from URL; no client row cache in this phase.
- Drawer health: client cache keyed by customer id.
- Optional short server/HTTP caching for APIs later; it does not replace drawer client cache.

## Consequences

- Clear ownership: URL/server for list, memory for health detail.
- List page warming / TanStack hydration remains a future optimization.
