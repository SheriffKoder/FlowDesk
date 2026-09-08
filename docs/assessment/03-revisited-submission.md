# Introduction
The goal is a simple way to quickly understand healthy vs at risk and prioritize time. This design supports that by making segment and health the first read (including a default health-then-name sort), keeping interaction cost low (filter → scan → open → act), and refusing chrome that competes with prioritization. CSMs spend their minutes on the accounts that need them — not on waiting, re-finding filters, or re-learning where they left off.

## A. High-Level Estimation
------------------------------------------------------------------------

**Core scope (the brief's three user stories): ~3–4 hours.**
Server-rendered list, URL-driven search / segment / sort / pagination, and a
details panel with health fetch. This is hands-on build time for one engineer
against a mock API, with no design handoff to negotiate.

**As actually shipped: ~7 hours.** The extra time went to work the brief did
not ask for — the two API routes (assumed provided), overview cards, app shell
and header, prefetch, and the unit + integration suites.

This is not a guess. I built it, and the commit history brackets it: scaffold
to working details-panel-with-cache in 3h06m, app chrome by 4h15m, and a
second session of roughly 2h30m for overview cards, visual polish, and docs.
Commit timestamps under-count planning before the first commit and over-count
breaks, so treat these as ±20%.

### What the number assumes
- One engineer, no handoff or coordination cost.
- Mock/fixture data behind a fixed API contract — no backend negotiation.
- No design handoff: I set the visual direction, so there are no review
  cycles. With designs supplied, add time for pixel matching; subtract the
  design decisions.
- Familiar structure. The URL helpers, table, and panel are patterns I have
  built before; that familiarity is most of the difference between 3 hours
  and 3 days.

### What would move it, and by how much
| Change | Effect |
|---|---|
| Real backend instead of fixtures (auth, pagination semantics, error shapes) | +4–8h |
| Supplied designs with pixel review cycles | +3–6h |
| Full a11y + cross-browser + responsive QA pass | +4h |
| Unfamiliar codebase or design system | 2–3× the whole estimate |
| List virtualization / very large datasets | +4–6h |

### Effort vs delivery
The hours above are effort, not lead time. The same feature moving through a
team — PR review, QA, design sign-off — is realistically 3–5 working days of
calendar time for the same amount of work. I would quote a stakeholder the
calendar figure and the team the effort figure.

## B. Architecture & Component Structure
------------------------------------------------------------------------

### Route: thin App Router entry at something like

Why: keep routing files thin so business logic lives in views/entities, not in Next.js entrypoints.
Clear ownership of the domain, easier refactors, and route files that stay readable.

```
app/customers/health/
  page.tsx       ← Server Component; fetches list from searchParams
  loading.tsx    ← first-paint / hard-nav skeletons
  error.tsx      ← route error + reset
  not-found.tsx  ← missing resource
```

### Layout:

Why: one root shell is enough; app chrome (sidebar + header) is cross-route, not page-local.

Root `app/layout.tsx` wraps children in `AppShell` (`widgets/app-sidebar`: icon rail / mobile dock + `AppHeader`).  
No nested `/customers` layout — page title/description come from `appPages` via `getCurrentPage`.

### Page:

Why: Server Component page keeps hooks and details panel state out of the route so the list can SSR cleanly.
Fast first paint for the table and interactive pieces isolated to client islands.

`page.tsx` parses URL params, loads list + overview aggregates, and renders the view composition — no hooks, no details panel state.

### URL as source of truth

Why: shareable links, back/forward, and refresh all restore the same list + details panel state without extra client stores.
Deep links CSMs can share, coherent browser history, and no duplicate list store to keep in sync.

| Params | Purpose |
|---|---|
| `search`, `segment`, `page`, `page_size`, `sort` (`field:order,...`) | Table list |
| `customerId` | details panel open target (mirrored after local open) |

### Field catalog + list config (copyable lists)

Why: one entity catalog owns field semantics; one view `list-config` owns page composition so cloning the list means changing API + configs, not hunting allow-lists.

The failure mode this avoids: sortable columns, the sort allow-list the API validates against, the search fields, and the table column list all drift apart because each one is declared where it happens to be used. Add a column and you edit four files; miss one and you ship a header that sorts nothing.

**Entity catalog** (`entities/customer/model/field-catalog.ts`) — one entry per field the customer list domain knows about, declaring the URL/API key, the domain path on `CustomerListItem`, a label, a type (`string` / `number` / `isoDate` / `enum`), and three capability flags: `sortable`, `searchable`, `filterable`.

| Field | Key | Type | Sortable | Searchable | Filterable |
|---|---|---|---|---|---|
| Name | `name` | string | ✓ | ✓ | |
| Domain | `domain` | string | | ✓ | |
| MRR | `mrr` | number | ✓ | | |
| Last active | `last_active` | isoDate | ✓ | | |
| Health | `health` | number | ✓ | | |
| Owner | `owner` | string | ✓ | | |
| Segment | `segment` | enum | | | ✓ |

The allow-lists are *derived* from those flags rather than written by hand, and the derivation is type-level — `CUSTOMER_LIST_SORT_FIELDS` is constrained to sortable keys, so listing a non-sortable field is a compile error, not a runtime 400. The catalog also exports the comparison helpers the repository uses (`customerListSortValue`, `customerListMatchesSearch`) and the triage default `DEFAULT_CUSTOMER_LIST_SORT_KEYS` (health asc, then name asc) so the default sort is declared once and shared by the URL parser and the query layer.

**View list-config** (`views/customer-health/model/list-config.ts`) — everything that is a product decision about *this page* rather than a fact about the domain: the query-string key names for this page's URL dialect, which catalog fields become columns and in what order, cell format ids and widths, the segment filter definition, page sizes (`10 / 20 / 50`, default `20`), which state changes reset `page` → 1, and the segment → badge-tone map that keeps domain enums out of `shared/ui`.

The split is the point. The entity says *MRR is a sortable number*; the view says *MRR is the second column, formatted as USD, and changing it resets the page*. Cloning this page for a different list means writing a new API loader and a new `list-config` against the same catalog — the table, sort control, pagination, and URL helpers stay untouched because none of them hard-code a field name.

### Page composition

Why: server-first composition with client islands only where interaction (URL, transitions, details panel) is required.
A small client surface area and a page that stays easy to reason about under change.

```
app/layout.tsx
  └─ AppShell (widgets)              ← sidebar + AppHeader
       └─ page.tsx (Server)
            ├─ loadOverviewCards()   ← portfolio aggregates (ADR-007)
            ├─ loadCustomerList()    ← filtered / paginated rows
            └─ CustomerHealthPage
                 ├─ OverviewCardsRow ← welcome + segment counts + placeholder
                 └─ CustomerListShell ← client (list URL + details panel)
                      ├─ toolbar / DataTable / pagination
                      └─ CustomerDetailsPanel
```

### Data boundaries

Why: list is shared/paginated (server cache); details panel health is personal and open-path (tiny client cache for fast reopen).
Correct caching per concern — shared list on the server, instant details panel reopen on the client.

List + overview: server fetch in `page.tsx` → props (server cache; no client row cache). Overview metrics are unfiltered portfolio aggregates ([ADR-007](../../docs/adr/007-server-aggregated-overview-metrics.md)).  
Health: client fetch + small in-memory cache inside the details panel path (`entities/customer/client`).

### Component breakdown

Why: each piece owns one job so we can ship, test, and swap UI without tangled responsibilities.
Parallel work, clearer reviews, and safer iteration on one control without breaking the rest.

#### AppHeader (layout)
Page icon, label, description from `appPages`; theme/actions slot + user area (not view-local).

#### OverviewCardsRow
Welcome metrics, segment counts, placeholder orb — server props; portfolio snapshot independent of list filters.

#### CustomerHealthToolbar
search (debounced), segment filter, useTransition / pending dim for list updates (client)

#### CustomerTable (`DataTable`)
rows from server props; columns: name, MRR, last active, health, owner (+ segment); sortable headers via shared `SortButton`; row click opens details panel

#### Sort control
shared dumb `SortButton` in header cells (label left, filled triangles + priority badge); shell patches URL `sort` through `useListUrl` (none → asc → desc → remove). **Multi-level append** — clicking another column adds a level (`sort=mrr:desc,name:asc`). Absent `sort` keeps health-then-name without lighting arrows or writing the URL. Legacy `sort=field&order=dir` still parses. `aria-sort` on sortable `<th>`.

#### Prefetch button
per-row Open pill; warms health cache on hover/focus (client)

#### Pagination
page / page_size; resets page → 1 when search, segment, sort, or size change

#### CustomerListShell
client island: toolbar + table + pagination + details panel; owns `useListUrl` + panel open state (`useCustomerDrawer`)

#### Details panel shell
focus trap, Escape, children slot (shared `DetailsPanel`, in-layout)

Naming: the surface is called the **details panel** throughout this document. Open/close state still lives in `features/customer-drawer` (`useCustomerDrawer`) — the older internal name for the same concern, kept because it is what the code exports.

#### Details panel body
events, usage, notes; sectioned with hairline dividers

### Loading UX:

Why: hard nav needs a full skeleton; filter changes should keep context; details panel should feel instant when prefetched.
A table that does not flash empty on every filter, plus a details panel that opens immediately when warm.

Hard nav → `loading.tsx` (row-density skeletons).  
Same-route param change → keep table, dim via `isPending`.  
Details panel cold open → local section skeletons; warm → paint from cache.

### Server components vs Client components

Where we draw the line: server by default; client only for interaction that needs hooks, events, or browser APIs.

#### Server
Why: list data and static chrome do not need the browser; they should render on the server with the request’s `searchParams`.
A fast first paint, smaller JS, and list fetching/caching that stays on the server.

For:
- `page.tsx` — parse URL params, fetch list + overview cards, compose the view
- `OverviewCardsRow` — welcome / segment counts from server aggregates
- `CustomerTable` shell — render rows from server props (non-interactive markup)
- Route shells — `loading.tsx`, `error.tsx`, `not-found.tsx`

#### Client side
Why: URL updates, pending transitions, details panel open state, prefetch, and a11y focus need React hooks and browser events.
Instant details panel open, dimmed table while params change, and warm health data without turning the whole page into a client tree.

For:
- `AppShell` / sidebar / header actions — navigation chrome, theme switcher
- `CustomerListShell` + toolbar — search debounce, segment filter, `useTransition` / pending dim
- Sort control — header clicks write multi-level `sort=field:order,...`
- Prefetch button — hover/focus warms the health cache
- Pagination controls — update `page` / `page_size`
- `CustomerDetailsPanel` + body — local open first, sync `customerId`, fetch/cache health, focus trap / Escape

#### Conclusion
Server owns the list, overview metrics, and page frame; client owns interaction islands. That split keeps the route shareable and SSR-friendly while still meeting the product goals of fast details panel open and non-freezing filter/pagination UX.


## C. Data Fetching & State Management
------------------------------------------------------------------------

How list data, details panel health, and UI states are fetched and owned — without TanStack this phase.

### Fetching the paginated list of customers

Why: the list is driven by shareable URL params, so the server should fetch it per request from those params.
One source of truth for filters/pagination/sort, and server-side caching of list responses.

Flow:
1. Toolbar / sort / pagination update URL (`search`, `segment`, `page`, `page_size`, `sort`, `order`) inside `startTransition`.
2. Search is local draft first, then debounced into the URL (do not mirror every URL soft-nav back into the input — that snatches mid-typing); changing search, segment, sort, or `page_size` resets `page` → `1`.
3. Server `page.tsx` reads `searchParams`, calls the list path (`GET /api/customers?...` via entity query/repository).
4. Rows + total/meta come back as props into `CustomerTable` — no client row cache this phase.

### Fetching customer health details on row click

Why: details panel open must feel instant; waiting on URL or a cold network round-trip would fight that goal.
Local open first, optional warm cache from prefetch, URL only for share/restore.

Flow:
1. Prefetch button (hover/focus) may warm a tiny client in-memory cache keyed by customer id.
2. Row click → `CustomerListShell` opens from local state immediately → then mirrors `customerId` into the URL.
3. Host reads cache; on miss, fetches `GET /api/customers/{id}/health` and stores the result in the same cache.
4. Cold load / shared link with `customerId` hydrates state → opens details panel → fetch if cache miss.
5. Close clears local open state and removes `customerId`. Back/forward stay coherent with that param.

### Managing loading, error, and empty states

Why: each failure and wait mode has a different user context — blanking the whole page for every change is worse than scoped feedback.
Calm recovery where the problem happened, and empty copy that matches why the table has no rows.

#### Loading
- Hard navigation / first paint → route `loading.tsx` with row-density skeletons (~40–44px).
- Same-route param change → keep current rows, dim table via `useTransition` `isPending` (optional `pointer-events-none`) this avoids making the UI freeze on transitions by giving the user a pending feedback while stopping their interaction with the table i.e click/hover
- Details panel cold open → section skeletons inside the panel; warm cache → paint immediately.

#### Errors
- List / route failure → `error.tsx` with reset (does not take down unrelated chrome forever).
- Details panel health failure → local error + retry inside the panel; table stays usable.
- Missing customer / bad deep link → `not-found.tsx` where appropriate.

#### Empty
- True empty (no customers in the system) → distinct copy + calm next step.
- Filtered / search empty (no matches for current URL) → different copy; clear path to reset filters/search.


### Which libraries or patterns

Why: pick the smallest tool that matches each concern — server list vs instant details panel — instead of one client cache library for everything.
Less bundle and mental overhead this phase; room to adopt TanStack later if mutations or SPA list caching justify it this keeps the setup simple and open to scale.

#### We use

- Built-in `fetch` + Server Components — list data in `page.tsx` from URL `searchParams`; optional Next.js fetch cache / revalidate for shared list pages.

- URL as state — App Router `searchParams` + `router.push`/`replace` (`scroll: false`) for filters, pagination, sort, and details panel `customerId`.

- useTransition — pending dim on same-route list updates without blanking the table.

- Custom hooks — e.g. `useCustomerDrawer` (open-first, URL mirror/hydrate) and toolbar URL helpers; debounce on search input.

- Tiny custom client cache — in-memory `Map` (or equivalent) keyed by customer id for health prefetch + reopen (no React Query / SWR this phase).

- Zod (schemas) — validate API contracts at the entity boundary.

#### We do not use (this phase)
- TanStack Query / React Query — list is server+URL owned; details panel only needs a small id→payload cache. Adding Query now would be mostly ceremony.
- SWR — same reason; redundant with server fetch for the list and overkill for one details panel cache.
- Zustand / Redux — no cross-tree domain store needed; URL + local details panel state cover it.

#### Later (only if justified)
TanStack Query (or similar) if list updates feel too slow without a client SPA cache, or if write/mutation workflows appear and need shared cache invalidation.


## D. UX Details & Edge Cases
------------------------------------------------------------------------
### How would we handle:

#### Slow network responses
- List: keep current rows visible and dim only after pending lasts ~200ms (`useDelayedPending` over `useTransition`) so fast updates do not flicker; optional `pointer-events-none` while dimmed so the UI does not freeze or flash empty on slow fetches.

- Hard nav / first paint: route `loading.tsx` with row-density skeletons.

- Details panel: open the shell immediately; show section skeletons only on cold health fetch; warm cache paints without a spinner.

- Prefetch button: warm health on hover/focus so a later row click often skips the wait.

- Optional: short server `fetch` revalidate for list pages; 
Next.js can cache that fetch and refresh it on a timer (e.g. next: { revalidate: 30 }) or via tags. That means repeated visits to the same filtered page can reuse a recent server response instead of always hitting the origin.

- Optional: TanStack only if SPA list caching becomes necessary.
keep list pages in the client so paging/filtering feels like an SPA (instant revisit, background refetch). We skipped it because the URL + server fetch + useTransition dim already cover the product goals. Add it only if that still feels too slow or you need client-side invalidation after writes.

both optional, only if the current approach isn’t enough.


#### Keeping filters / search in sync with the URL
- URL `searchParams` are the source of truth for `search`, `segment`, `page`, `page_size`, `sort`, `order`.

- Toolbar writes params via `router.push` / `replace` with `{ scroll: false }` inside `startTransition`.

- Search uses local input state + debounce, then commits to the URL (avoids per-keystroke sync thrash).

  **By default**, a naive “controlled from URL” search does this: debounce pushes `search` → soft-nav settles → `value` prop updates → an effect mirrors `value` back into the input. That **snatches** characters the CSM typed after the commit (mid-word revert).

  **So we have to** keep the visible field on **local draft** as the typing source of truth, push trimmed commits to the URL separately, and rehydrate from the URL `value` **only** when it differs from our last commit (back/forward / external history) — never on echoes of our own debounced soft-nav.

- Changing search, segment, sort, or page size also resets `page` → `1` in the same URL update.

- Server `page.tsx` always reads the current params to fetch — refresh and shared links restore the same filtered view.

#### Preserving scroll position or selection when navigating back to the page
- Scroll: list param updates use `{ scroll: false }` so filter/pagination changes do not jump to the top; browser back/forward can restore scroll for normal navigations.
- Selection: derive selected row from URL `customerId` (no separate selected-row store).
- Details panel: open state hydrates from `customerId` on load / back / forward, so returning to the page reopens the panel and highlights the same row.
- Close removes `customerId`; back into a URL that still has it restores selection again.

### UX edge cases we would consider:

- Fast details panel open without waiting on the URL or a cold network round-trip (open local state first, then sync `customerId`)

- Shareable deep links that still restore an open details panel and selected row on load / back / forward

- Filter, search, sort, and pagination updates that do not blank or freeze the table (dim via `useTransition` / `isPending`, optional `pointer-events-none`)

- Debounced search so typing does not thrash the URL and refetch on every keystroke (local draft owns the field; URL rehydrate only on external history — otherwise soft-nav echoes snatch mid-word input)

- Resetting to page 1 when search, segment, sort, or page size change so users do not land on an empty high page

- Distinguishing true empty (no customers) from filtered / search empty (no matches) with different copy and recovery

- Prefetch that warms health without accidental row-hover spam (dedicated prefetch button on hover/focus)

- Details panel a11y: focus trap, Escape to close, focus return to the trigger row / control

- Scoped errors: route `error.tsx` / `not-found` for the list path; panel-local error + retry so the table stays usable

- Keeping the first viewport calm and work-tool dense (no decorative page card wrapper; details panel body as sections with hairline dividers)

- Stale search input vs URL — user types, navigates back before debounce fires; input should rehydrate from URL, not keep half-typed local state

- Concurrent opens — rapid row clicks; cancel in-flight health fetch or key UI by id so the panel body doesn’t flash the wrong customer

- Handle invalid / unknown URL params from search, page

- Keyboard / focus on the table — Enter/Space on row opens the details panel

- Mobile / narrow width — panel as full-screen sheet instead of a side panel; table horizontal scroll without losing sticky name/actions

- Reduced motion — skip or soften dim/transition animations when prefers-reduced-motion

- Offline / API down mid-session — retry copy that distinguishes “you’re offline” from “server error”

- Long names / empty cells — truncation + tooltip; missing MRR / owner / last active show em dash, not blank layout shift

- Default sort: health then name on first land (no sort param yet) so at-risk / lower health surfaces first; ties break alphabetically for a stable scan. Explicit URL multi-level `sort=field:order,...` still overrides when the CSM chooses columns (append levels on extra clicks).


## E. Task Breakdown
------------------------------------------------------------------------
Concrete backlog tickets (small, shippable). Order roughly matches dependency; some can parallelize after scaffold + API foundation.

### Foundation
1. Scaffold file structure — views / entities/customer / shared stubs, thin `app/customers/health` route shells (`page`, `loading`, `error`, `not-found`), API route placeholders, root `tests/` + README
2. Route chrome — server `page.tsx` composition shell (toolbar / table / panel placeholders), theme padding, no page-wide card wrapper
3. URL contract helpers — parse/serialize `search`, `segment`, `page`, `page_size`, multi-level `sort`, `customerId`; defaults include health-then-name sort; page-reset rules; unit tests

### Data & API
4. Customer fixtures + Zod schemas/transforms — list row + health payload shapes
5. `GET /api/customers` — search, segment, pagination, multi-level sort; validation vs empty vs error status mapping; integration test
6. `GET /api/customers/{id}/health` — happy path + not-found; integration test
7. Entity query/repository wiring — server list fetch use-case from parsed searchParams; integration test (searchParams → list props)

### Table UI
8. App chrome — `AppShell` / `AppHeader` / sidebar (replaces view-local PageHeader)
9. Configurable table — columns name, MRR, last active, health, owner + segment treatment; mock rows first
10. Wire server list into table — replace mock default path; true-empty state
11. Pagination controls — URL `page` / `page_size`; shareable pages
12. Pending list UX — `useTransition` dim + `aria-busy` (optional `pointer-events-none`); skeletons only on hard nav
13. Search input — debounced URL `search`; reset page → 1; filtered-empty copy
14. Segment filter — Healthy / Watch / At Risk; URL `segment`; reset page; keyboard-operable control
15. Sort headers — multi-level append `sort=field:order,...`; `aria-sort`; default health then name when params absent

### Details panel
16. Panel shell — in-layout details panel, focus trap, Escape, close, focus return; section layout with hairline dividers
17. `useCustomerDrawer` + `CustomerListShell` — open-first local state, mirror/hydrate `customerId`, derived row selection; unit tests (mocked router)
18. Row open affordances — click + Enter/Space open panel; selected row from `customerId`
19. Health fetch in panel — client fetch, local loading/error/retry; sectioned body (events, usage, notes)
20. In-memory health cache — id-keyed Map; warm reopen; unit tests
21. Prefetch button — beside name; hover/focus warms cache; accessible label; does not steal row click

### Overview + hardening
22. Overview cards — welcome metrics + segment counts + placeholder; `loadOverviewCards` (ADR-007)
23. Empty-state pass — true empty vs filtered/search empty copy + reset affordances
24. Error taxonomy pass — route error/not-found vs panel-local retry; invalid URL param fallbacks / page clamp
25. A11y + theme audit — row density, skeletons, segment not color-only, mobile sheet, reduced-motion where animations exist
26. Test gate — unit suite green (URL, schemas, panel state hook, cache) + three integrations green; document known gaps

## F. Conclusion
------------------------------------------------------------------------
After this plan, a CSM should feel the Customer Health page as a calm work tool — not a dashboard to decode. They open it and immediately see who is healthy and who is at risk, then dig in only where it matters.

### How it behaves for them
- Land on a clear table of name, MRR, last active, health, and owner — dense enough to scan, quiet enough to trust — already ordered by health then name so triage starts without an extra click.
- Filter to At Risk / Watch (or search a name/domain) and the list updates without the table vanishing or freezing; the page still feels like the same place.
- Sort and page through large accounts with shareable URLs, so a morning triage view or a link to a teammate stays coherent.
- Click a row and the details panel opens at once; events, usage, and notes appear without a full-page detour. Prefetch makes repeat peeks feel instant.
- Come back tomorrow (or from a shared link) and the same filters, page, and open account are still there — selection and context survive navigation.
- When something is empty, slow, or broken, the UI tells them why in place (no matches vs no customers; panel retry vs whole-page error) so they keep moving.
