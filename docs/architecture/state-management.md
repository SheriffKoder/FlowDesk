# State management

## Stack for this phase

| Concern | Mechanism |
|---|---|
| List filters, pagination, sort | URL `searchParams` (source of truth) |
| Default list order | Parse/query: absent `sort`/`order` → health (risk-first) then name |
| Table pending UX | `useTransition` around router updates (`scroll: false`) |
| Search typing | Local input state + debounce → URL; rehydrate from URL on history nav |
| Drawer open / selected customer | Local state (instant open); **selection = `customerId` only** |
| Drawer share / restore / back | URL `customerId` mirrored from state; hydrate from URL on load |
| Drawer health payload | Simple client fetch + in-memory cache (no TanStack this phase) |
| Auth / theme | Existing context patterns |
| Cross-tree UI domain state | Not needed yet — avoid Zustand/Redux until justified |
| Client list SPA cache | Not this phase — no SWR / TanStack |

## Rules

1. **Do not** put the drawer hook in `page.tsx` — keep the page a Server Component; put hooks in client children.
2. **Do not** make “URL change” the thing that starts opening the drawer on click — state opens first; URL follows.
3. Derive row selection from `customerId` — do not duplicate selected-row state.
4. Reset `page` to `1` when search, segment, sort, or page size change (same transition as the URL update).
5. Use `{ scroll: false }` on list param navigations.
6. On rapid drawer target changes, cancel or ignore stale health responses (key UI by customer id).

## Later (out of scope now)

TanStack Query for list SPA cache or drawer — only if pending transitions feel too slow or mutation workflows appear.  
Optional short Next/`fetch` revalidate for shared list pages.
