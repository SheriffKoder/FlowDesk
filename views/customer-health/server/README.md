/**
 * @file views/customer-health/server/README.md
 *
 * Server use-cases for the Customer Health view (RSC entry points).
 */

# server/ — Customer Health

| File | Role |
| --- | --- |
| `load-customer-list.ts` | `searchParams` → `listCustomers` → table/page props |

Call from `app/customers/health/page.tsx` only (or tests). Do not import fixtures here — data stays behind `entities/customer`.
