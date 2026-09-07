# Initial file structure

Target layout for FlowDesk after scaffold. Prefer **wide, not deep**. Only create folders a unit needs.

> **Note:** The repo may keep Next.js `app/` at the project root during migration. New domain code should follow this tree (`src/` recommended). Thin route files re-export or render view composition only.

## Top-level

```
├── src/                    # (or project root — see note above)
│   ├── app/                # Routing entrypoints only — no business logic
│   ├── views/              # Route/page composition
│   ├── features/           # Reusable workflows (multi-view)
│   ├── entities/           # Domain concepts
│   ├── widgets/            # Composed reusable UI sections
│   └── shared/             # Cross-domain, no business logic
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

## Customer Health — expected units (scaffold target)

```
src/
├── app/
│   ├── customers/health/          # or customer-health — thin re-exports
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   └── api/
│       └── customers/
│           ├── route.ts           # GET list
│           └── [id]/health/route.ts
│
├── views/
│   └── customer-health/
│       ├── README.md
│       ├── ui/                    # view-only composition pieces if needed
│       ├── hooks/                 # e.g. URL param helpers used only here
│       └── model/                 # view-local types if any
│
├── features/
│   └── customer-drawer/           # optional: drawer workflow if it grows
│       ├── ui/
│       ├── hooks/                 # useCustomerDrawer
│       └── model/
│
├── entities/
│   └── customer/
│       ├── model/
│       ├── schema/
│       ├── transform/
│       ├── repository/
│       ├── queries/
│       ├── client/                # health fetcher + tiny cache
│       ├── errors/
│       └── README.md
│
├── widgets/                       # only if a composed block is reused
│
└── shared/
    ├── ui/                        # page-header, table, pagination, search, filter, panel, sort
    ├── lib/                       # debounce, cn, url helpers
    ├── hooks/
    └── ...
```

## Shared UI expected for this feature

| Component | Role |
|---|---|
| `page-header` | Title + supporting paragraph |
| Configurable `table` | Header + rows from column config |
| `pagination-*` | Footer, page size, navigation |
| Search input | Param label, placeholder, debounce |
| Filter control | Button + dropdown; column/label/options |
| Sort control | Header-cell island; URL sort/order |
| Panel / drawer shell | Children slot; a11y focus trap |

## Public API rule

Only `index.ts` is public per slice. No deep imports across features/entities.

## Root `tests/` layout

| Path | Contains |
|---|---|
| `tests/unit/` | Pure rules: URL contract, schemas/transforms, drawer hook (mocked router), health cache |
| `tests/integration/` | Boundary tests: list API, health API, searchParams → list props wiring |
| `tests/fixtures/` | Shared customer/health fixtures reused by API + tests |

Prefer testing **rules and boundaries** over presentational snapshots. See [guides/testing.md](./guides/testing.md).

## Docs per unit

| Size | Docs |
|---|---|
| Small | `README.md` |
| 5+ files/folders | + `docs/responsibilities.md` |
| Real tradeoffs | + `docs/architecture.md` / `docs/decisions.md` |
