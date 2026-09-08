# Testing

Strategy for Customer Health: **unit-test rules**, **integration-test boundaries**, defer broad E2E.

Tests live at the **repo root** under `tests/`. Runner: **Vitest** (`npm test` / `npm run test:watch`).

```
tests/
├── unit/
├── integration/
└── fixtures/
```

## Unit (weave into implementation steps)

| Area | Examples | Status |
|---|---|---|
| URL contract | parse/serialize, defaults, reset `page` → 1, clamp, sort header cycle | Landed (`list-url-params.test.ts`) |
| Schemas / transforms | list + health Zod; raw → domain | Landed (`customer-schemas.test.ts`) |
| Debounce helper | quiet period, cancel, flush | Landed (`debounce.test.ts`) |
| Drawer hook / state | open/close, URL mirror, hydrate from `customerId`, derived selection | Landed (`customer-drawer-state.test.ts`) |
| Health client cache | set / get / hit after prefetch; fetch write-through; offline / 404 kinds | Landed (`customer-health-cache.test.ts`) |
| Silent health prefetch | skip cached; dedupe in-flight; failures never throw | Landed (`prefetch-customer-health.test.ts`) |

Skip heavy tests on pure presentational chrome unless it encodes real rules.

## Integration (three required steps)

1. **`GET /api/customers`** — search, segment, page, page_size, multi-level sort against fixtures. Landed (`customers-list.api.test.ts`).  
2. **`GET /api/customers/{id}/health`** — happy path + not-found. Landed (`customer-health.api.test.ts`).  
3. **List wiring** — `searchParams` → `loadCustomerList` → shaped list props. Landed (`customer-list-page.test.ts`).

## Out of scope (this phase)

- Exhaustive Playwright coverage  
- Component snapshot walls  
- Client table-row cache tests (not built yet)

## When to add a test

| Change | Prefer |
|---|---|
| New URL param rule | Unit |
| API response shape | Unit schema + integration route |
| Drawer open/URL sync | Unit hook |
| Filter/pagination correctness | Integration list API (+ wiring if mapping is non-trivial) |
