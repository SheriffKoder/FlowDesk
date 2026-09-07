# Routing

## Route

Customer Health lives as an App Router page under the views/composition pattern (thin `app/` entry → `views/...` composition). Exact path is chosen during scaffold (e.g. `/customers/health` or `/customer-health`).

Root `app/layout.tsx` is enough for now — **no nested `/customers` layout** until shared chrome is needed.

## URL contract (list + drawer)

| Param | Role | Notes |
|---|---|---|
| `search` | Name/domain search | Debounced from the search input; rehydrate local input from URL on back/forward |
| `segment` | `healthy` \| `watch` \| `at_risk` (final enum in schema) | Segment filter; invalid → default/fallback |
| `page` | 1-based page index | Reset to `1` when search/segment/sort/page_size change; **clamp** when total pages shrink |
| `page_size` | Page size | Shared pagination control |
| `sort` | Column key | From sort system. **Absent** → resolve default health (risk-first) then name in parse/query (URL need not include sort on first land) |
| `order` | `asc` \| `desc` | Paired with `sort`; absent with sort → follow default sort rules |
| `customerId` | Open drawer target | Mirrored from local drawer state; hydrates open on load; selection derived from this only |

Use `router.push` / `replace` with `{ scroll: false }` for param updates. Wrap list updates in `startTransition`.

## Drawer URL behavior

1. Click open → local state opens immediately → then sync `customerId`.
2. Close → clear state → remove `customerId`.
3. Cold load / shared link with `customerId` → hydrate state → open drawer → fetch health if cache miss.
4. Browser back/forward should stay coherent with `customerId` presence.
5. Rapid switches between customers: cancel in-flight health fetch or key UI by id (no wrong-customer flash).

## APIs

```
GET /api/customers?search=&segment=&page=&page_size=&sort=&order=
GET /api/customers/{id}/health
```

Route handlers stay thin adapters; domain logic lives under `entities/customer`. List handlers honor explicit sort **or** the health-then-name default when sort params are omitted.
