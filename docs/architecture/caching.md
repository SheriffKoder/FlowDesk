# Caching

## This phase

| Surface | Cache | Why |
|---|---|---|
| Customer table list | Server-driven fetch from URL; optional short Next/`fetch` revalidate later | Correctness for shareable filtered views; large pages stay on the server |
| Customer health drawer | Client in-memory cache keyed by customer id | Fast reopen + prefetch-on-button-hover without a second spinner |

**TanStack Query is not used in this phase.**

## Prefetch

- Prefetch **health** on intentional **prefetch button** hover (beside name), not on whole-row hover.
- Row click opens the drawer (no prefetch required for open).
- Prefetch writes into the same client cache the drawer reads.

## List warming (optional later)

Prefetching adjacent list pages into a client cache is deferred. Prefer server list + pending dim first.

## Mental model

- **Server cache** = cheaper responses for everyone.
- **Client cache** = reuse for *this tab’s* next drawer open.

Drawer fast-open needs client cache. Server cache alone still costs a network round-trip.
