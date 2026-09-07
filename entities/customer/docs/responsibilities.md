# Customer entity — responsibilities

Skim map of `entities/customer` by folder. Import only via the public `index.ts`.

## Root

| File | Role |
| --- | --- |
| `index.ts` | Public API — re-exports model, schema, transform, queries, errors, client fetch/cache |
| `README.md` | Unit overview: owns / does not own |

## `model/` — domain shapes

| File | Role |
| --- | --- |
| `segment.ts` | Canonical segment enum + labels / `CUSTOMER_SEGMENT_OPTIONS` for filter chips |
| `field-catalog.ts` | Shared list field catalog (keys, paths, sort/search/filter flags) + default triage keys |
| `customer.ts` | Domain types: list row, health detail, events, usage points |
| `customer-list-query.ts` | List use-case input/output; re-exports sort fields from field catalog |

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
| `customers-repository.ts` | Load fixtures; filter/sort via field catalog; paginate list |
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

## `client/` — browser health fetch + tab cache

| File | Role |
| --- | --- |
| `health-cache.ts` | In-memory Map API (`get` / `set` / `has` / `clear`) for drawer + prefetch |
| `customer-health-fetch-error.ts` | Client error kinds: offline / not_found / network / server / … |
| `fetch-customer-health.ts` | Cache-first GET `/api/customers/{id}/health`; Zod validate; write-through |

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

## Call path (health — browser)

```text
CustomerDetailsPanel / prefetch
  → fetchCustomerHealth (cache-first)
  → GET /api/customers/[id]/health
  → setCachedCustomerHealth
```
