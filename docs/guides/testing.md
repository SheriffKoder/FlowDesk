# Testing

Strategy for Customer Health: **unit-test rules**, **integration-test boundaries**, defer broad E2E.

Tests live at the **repo root** under `tests/`.

```
tests/
├── unit/
├── integration/
└── fixtures/
```

## Unit (weave into implementation steps)

| Area | Examples |
|---|---|
| URL contract | parse/serialize, defaults, reset `page` → 1 |
| Schemas / transforms | list + health Zod; raw → domain |
| Drawer hook | open/close, URL mirror, hydrate from `customerId` (mocked router) |
| Health client cache | set / get / hit after prefetch |

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
