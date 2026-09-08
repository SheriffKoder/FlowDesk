# ADR-001: Server-first Customer Health page

## Status

Accepted

## Context

The Customer Health overview is read-heavy. We need fast first paint and a clear split between server work and interactive chrome.

## Decision

- Keep `page.tsx` a Server Component: parse `searchParams`, fetch the customer list and overview aggregates, pass props down.
- Client components only for list shell (toolbar, sort, pagination), details panel, prefetch, and app chrome interaction.
- Ship `loading.tsx`, `error.tsx`, and `not-found.tsx` with the route.
- Use root `app/layout.tsx` + `AppShell` (`widgets/app-sidebar`) for cross-route chrome; defer a nested `/customers` layout until shared customer chrome is needed.

## Consequences

- First visit gets server HTML for the table and overview cards.
- Hooks (drawer, transitions) live in client children, not in `page.tsx`.
- Composition follows: `AppShell` chrome → overview cards (server) + `CustomerListShell` (client: toolbar / table / pagination / details panel).