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
| URL contract | parse/serialize, defaults, reset `page` → 1, clamp | Landed (`list-url-params.test.ts`) |
| Schemas / transforms | list + health Zod; raw → domain | Expected |
| Drawer hook | open/close, URL mirror, hydrate from `customerId` (mocked router) | Expected |
| Health client cache | set / get / hit after prefetch | Expected |

Skip heavy tests on pure presentational chrome unless it encodes real rules.

## Integration (three required steps)

1. **`GET /api/customers`** — search, segment, page, page_size, sort/order against fixtures.  
2. **`GET /api/customers/{id}/health`** — happy path + not-found.  
3. **List wiring** — `searchParams` → query → shaped list props (server helper / query use-case).

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
