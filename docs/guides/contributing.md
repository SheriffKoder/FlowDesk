# Contributing

## Before coding

1. Read [project-phases.md](../project-phases.md) for where the work sits.
2. Read locked ADRs under [../adr/](../adr/).
3. For implementation order and checklist, use `app/development/project/plan-clean.md` (local).
4. Follow theme rules in `app/development/project/project-theme.md` (local) and tuned tokens in `app/globals.css`.

## Structure

- Split by **layer** by default; subarea only if self-contained.
- Dependency direction: `views → features → entities → shared`.
- Public exports via `index.ts` only — no deep imports across slices.
- Route files in `app/` stay thin; composition lives in `views/`.
- Domain folders (`views/`, `features/`, `entities/`, `shared/`, `widgets/`) must stay in `tailwind.config.ts` `content` so classes are scanned.

## Documentation style

- New or substantially edited modules: `@file` header + JSDoc on exports (see project guidelines).
- Unit docs: `README.md`; add `docs/responsibilities.md` around 5+ files across layers.

## Commits

Do **not** commit `app/development/` (gitignored).

```text
feat|fix|docs|chore(scope): short imperative summary

One sentence why.

- outcome bullet
- outcome bullet
```

## Testing

- Place tests under root `tests/` (`unit/`, `integration/`, `fixtures/`) — see [testing.md](./testing.md).
- Add **Testing:** notes alongside **UX** when landing a step that introduces rules or API boundaries.

## Pull requests

- Note which implementation step(s) from `plan-clean.md` this closes.
- Call out URL contract or API changes explicitly.
- Verify loading, empty (both kinds), error, and drawer a11y when touching those surfaces.
- Include or update unit/integration tests when the step lists a **Testing:** item.
