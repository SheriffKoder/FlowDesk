# Initial file structure

Layout for FlowDesk after scaffold. Prefer **wide, not deep**. Only create folders a unit needs.

> **Current layout:** domain code lives at the **project root** next to `app/` (`views/`, `entities/`, `features/`, `shared/`, `widgets/`). A later move under `src/` is optional; thin route files still re-export or render view composition only.
>
> Tailwind `content` in `tailwind.config.ts` must include those domain folders so utility classes are emitted.

## Top-level

```
├── app/                    # Routing entrypoints only — no business logic
├── views/                  # Route/page composition
├── features/               # Reusable workflows (multi-view)
├── entities/               # Domain concepts
├── widgets/                # Composed reusable UI sections
├── shared/                 # Cross-domain, no business logic
├── components/             # Existing shadcn primitives (migrate into shared/ui over time)
├── tests/                  # Root test suite (unit + integration + fixtures)
│   ├── unit/
│   ├── integration/
│   └── fixtures/
└── docs/                   # App-wide docs
```

Dependency direction:

```
views → features → entities → shared
```

## Layer vocabulary

Use these names only — never invent synonyms (`helpers/` → `lib/`, `actions/` → `server/`):

| Folder | Contains |
|---|---|
| `model/` | Types + domain logic (pure) |
| `ui/` | Components |
| `hooks/` | React hooks |
| `lib/` | Pure helpers, no I/O |
| `server/` | Server use-cases / actions |
| `client/` | Client-side fetchers |
| `repository/` | Data access (DB/API CRUD) |
| `schema/` | Validation (Zod etc.) |
| `queries/` | Read use-cases |
| `commands/` / `mutations/` | Write use-cases |
| `cache/` | Pure cache-update helpers |
| `transform/` | Raw → domain reshaping |
| `errors/` | Custom error types |
| `providers/` | Context providers |
| `services/` | External service wrappers |

**Split by layer by default.** Subarea folders only if that subtree has zero shared dependents.

## Customer Health — units (scaffolded)

```
app/
├── customers/health/              # thin entry → views/customer-health
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
└── api/
    └── customers/
        ├── route.ts               # GET list (placeholder → implement later)
        └── [id]/health/route.ts

views/
└── customer-health/
    ├── README.md
    ├── ui/                        # PageHeader, toolbar, CustomerTable, list shell (+ details)
    ├── hooks/
    ├── model/                     # list-config, list-url-params, columns, table props
    └── lib/                       # parse/serialize list URL, page reset/clamp, resolve sort

features/
└── customer-drawer/               # details open/close + URL mirror + health body
    ├── ui/                        # CustomerDetailsPanel, health body/error
    ├── hooks/                     # useCustomerDrawer, useCustomerHealth
    ├── lib/                       # health error copy
    └── model/                     # pure open/hydrate/selection helpers

entities/
└── customer/
    ├── model/                     # field-catalog, segment, list query, domain types
    ├── schema/
    ├── transform/
    ├── repository/                # filter/sort via field catalog
    ├── queries/
    ├── client/                    # health fetcher + tiny cache
    ├── errors/
    ├── docs/responsibilities.md
    └── README.md

widgets/                           # only if a composed block is reused

shared/
├── ui/
│   ├── table/                     # DataTable (landed)
│   ├── pagination/                # Pagination footer (landed)
│   ├── search-input/              # SearchInput debounce + rehydrate (landed)
│   ├── filter-option-buttons/     # Multi/single option button row (landed)
│   ├── sort-button/               # Dual filled-triangle header sort toggle (landed)
│   └── details-panel/             # In-layout DetailsPanel + focus trap (landed)
├── lib/                           # debounce, cn, url helpers
└── hooks/
```

## Shared UI for this feature

| Component | Role | Status |
|---|---|---|
| Configurable `DataTable` | Header + rows from column config; `onRowClick` / selection / pending; optional `aria-sort` | Landed |
| `page-header` | Title + supporting paragraph | View-local for now; move to shared later |
| `pagination-*` | Footer, page size, navigation | Landed |
| Search input | Param label, placeholder, debounce | Landed |
| Filter control | Multi-select option button row (`FilterOptionButtons`) | Landed |
| Sort control | Header-cell `SortButton`; multi-level URL `sort=field:order,...` | Landed |
| Details panel | In-layout side panel; focus trap, Escape, close (not overlay) | Landed |

## Public API rule

Only `index.ts` is public per slice. No deep imports across features/entities.

## Root `tests/` layout

| Path | Contains |
|---|---|
| `tests/unit/` | Pure rules: URL contract (**landed**), schemas/transforms, drawer state (**landed**), health cache (**landed**) |
| `tests/integration/` | Boundary tests: list API, health API, searchParams → list props wiring |
| `tests/fixtures/` | Shared customer/health fixtures reused by API + tests |

Prefer testing **rules and boundaries** over presentational snapshots. See [guides/testing.md](./guides/testing.md).

## Docs per unit

| Size | Docs |
|---|---|
| Small | `README.md` |
| 5+ files/folders | + `docs/responsibilities.md` |
| Real tradeoffs | + `docs/architecture.md` / `docs/decisions.md` |
