# Shared hooks

Client hooks with no domain coupling. Domain hooks belong in features/entities.

| Hook | Role |
|---|---|
| `useDelayedPending` | Delay `useTransition` pending before showing dim — avoids flicker on fast/cached soft-nav |

Import via `@/shared/hooks` (or `@/shared`).
