# ADR-007: Server-aggregated overview card metrics

## Status

Accepted

## Context

The Customer Health page shows overview cards (welcome metrics, segment distribution) above the URL-driven list. Those numbers are portfolio totals/averages derived from the same fixture-backed customer set as the table. Computing them in the client would either duplicate entity access, re-fetch, or require shipping full row sets to the browser just to sum/count.

## Decision

- **Aggregate on the server** in a view use-case (`loadOverviewCards`): one unfiltered portfolio load → welcome metrics (customers / MRR / avg health) + per-segment counts.
- **Pass pre-shaped props** into dumb card UI (`WelcomeCard`, `SegmentCountsCard`). Cards format/layout only; they do not derive totals.
- Overview aggregates **ignore list URL filters** (search / segment / page / sort) so the strip stays a stable portfolio snapshot while the table below remains filterable.
- Do **not** self-HTTP to `/api/customers` for this path — same RSC-friendly pattern as `loadCustomerList`.

## Consequences

- First paint includes overview numbers in the server HTML (aligned with ADR-001).
- Cards stay copyable/presentational; aggregation lives next to other view server loaders.
- Changing filter URL state does not recompute overview cards unless the route remounts / data source changes.
- A future real DB should expose the same aggregate shape (or a dedicated summary query) rather than moving math into the client.
