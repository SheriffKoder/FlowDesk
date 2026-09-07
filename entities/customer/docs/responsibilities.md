# Customer entity — responsibilities

Skim map of `entities/customer` by folder. Import only via the public `index.ts`.

## Root

| File | Role |
| --- | --- |
| `index.ts` | Public API — re-exports model, schema, transform, queries, errors, client cache |
| `README.md` | Unit overview: owns / does not own |

## `model/` — domain shapes

| File | Role |
| --- | --- |
| `segment.ts` | Canonical segment enum + labels / `CUSTOMER_SEGMENT_OPTIONS` for filter chips |
| `customer.ts` | Domain types: list row, health detail, events, usage points |
| `customer-list-query.ts` | List use-case input/output + sort field/order constants |

## `schema/` — Zod contracts

| File | Role |
| --- | --- |
| `customer-list-item.schema.ts` | Validate one list row (raw → parsed) |
| `customer-list-response.schema.ts` | Validate paginated list API response shape |
| `customer-health.schema.ts` | Validate health detail, events, usage points |

## `transform/` — raw → domain

| File | Role |
| --- | --- |
| `to-customer-list-item.ts` | Parse/validate list rows via Zod (`toCustomerListItem(s)`) |
| `to-customer-health.ts` | Parse/validate health payload via Zod (`toCustomerHealth`) |

## `repository/` — data access

| File | Role |
| --- | --- |
| `customers-repository.ts` | Load fixtures; filter, sort, paginate list |
| `get-customer-health.ts` | Look up health by id; map not-found / upstream errors |

## `queries/` — use-cases

| File | Role |
| --- | --- |
| `list-customers.ts` | List use-case; page clamp (no view imports) |
| `get-customer-health.ts` | Health use-case; thin wrapper over repository |

## `errors/` — typed failures

| File | Role |
| --- | --- |
| `customer-errors.ts` | `CustomerError` family + `isCustomerError` for API status mapping |

## `client/` — browser-side cache (stub)

| File | Role |
| --- | --- |
| `health-cache.ts` | In-memory Map API for drawer cache (wired in later tickets) |

## Call path (list)

```text
GET /api/customers
  → queries/list-customers
  → repository/customers-repository
  → transform + schema + fixtures
```

## Call path (health)

```text
GET /api/customers/[id]/health
  → queries/get-customer-health
  → repository/get-customer-health
  → transform + schema + fixtures
```
