# Shared

Cross-domain primitives with **no business logic**. Dependency leaf — anything may import shared; shared must not import views, features, or entities.

## Layout

| Path | Role |
|---|---|
| `ui/` | page-header, table, pagination, search, filter, sort, panel/drawer shell |
| `lib/` | debounce, `cn`, URL helpers |
| `hooks/` | reusable client hooks with no domain coupling |

Existing shadcn primitives under `components/ui` remain for now; migrate into `shared/ui` as Customer Health components land.
