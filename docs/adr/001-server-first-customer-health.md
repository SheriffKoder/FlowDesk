# ADR-001: Server-first Customer Health page

## Status

Accepted

## Context

The Customer Health overview is read-heavy. We need fast first paint and a clear split between server work and interactive chrome.

## Decision

- Keep `page.tsx` a Server Component: parse `searchParams`, fetch the customer list, pass props down.
- Client components only for toolbar, sort islands, drawer host, and other interaction.
- Ship `loading.tsx`, `error.tsx`, and `not-found.tsx` with the route.
- Use root `app/layout.tsx` only; defer a nested `/customers` layout until shared chrome is needed.

## Consequences

- First visit gets server HTML for the table data.
- Hooks (drawer, transitions) live in client children, not in `page.tsx`.
- Composition follows: PageHeader (server) + Toolbar (client) + Table (props) + DrawerHost (client).
