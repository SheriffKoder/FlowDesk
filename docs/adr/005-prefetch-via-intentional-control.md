# ADR-005: Prefetch via intentional control

## Status

Accepted

## Context

Prefetching health on every row hover causes unnecessary API traffic from accidental hovers. Row click must still open the drawer (product story).

## Decision

- Keep a **prefetch button** beside the customer name.
- Prefetch health on that control’s hover (or focus); write into the drawer client cache.
- Row click opens the drawer without requiring prefetch.
- Do not prefetch on whole-row hover.

## Consequences

- Intentional warm path for power users; safe default for scanning.
- Table name cell includes an extra control (a11y: named button, keyboard reachable).
