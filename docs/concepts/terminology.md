# Terminology

| Term | Meaning in this repo |
|---|---|
| View | Route composition unit under `views/` — assembles features/entities/shared |
| Feature | Reusable business workflow spanning more than one view |
| Entity | Domain concept (`entities/customer`) — types, schema, queries, repository |
| Shared | Cross-domain UI/helpers with no business logic |
| Client island | Small `"use client"` subtree inside a server page |
| URL contract | Canonical search/query params for a route |
| Pending dim | Table stays mounted; opacity/busy while `useTransition` is pending |
| True empty | No customers in the system/result set at all |
| Filtered empty | Customers exist but none match search/segment |
| Drawer host | Client boundary that owns drawer hook + panel shell |
| Prefetch control | Dedicated button that warms health cache on hover/focus |
| Layer split | Group by kind (`schema/`, `ui/`, …) — default |
| Subarea split | Group by feature slice — only if zero shared dependents |
| Integration 1–3 | List API, health API, and searchParams→list props tests under `tests/integration/` |
