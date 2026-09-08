# Project phases

FlowDesk Customer Health — phase map. Detailed implementation steps live in `app/development/project/plan-clean.md` (local).

---

## Phase 1 — Product brief

**Goal:** Understand the product brief and constraints.

**Sub-steps**
- Read project scope (Customer Health user stories + APIs).
- Capture stack assumptions (Next App Router, TypeScript, Tailwind, design-system components).
- Identify must-haves: sortable table, filters/search, pagination, detail drawer, loading/error.

**UX ideas**
- CSM opens one page and can prioritize At Risk accounts in under a minute.
- Detail without losing list context (drawer, not full navigation away).

---

## Phase 2 — Design settle

**Goal:** Agree visual and interaction language before building.

**Sub-steps**
- Light theme guidelines (Notion/ClickUp/Jira-like density).
- Tune existing CSS tokens in `globals.css` (no parallel token dump).
- Define table density, filter band, drawer width, segment colors (meaning).

**UX ideas**
- Soft canvas + white surfaces; hairline borders; 6–8px radius.
- One filter band; no card-wrapped page.
- Segment badges: Healthy / Watch / At Risk with text labels (not color alone).

---

## Phase 3 — Initial plan and review

**Goal:** Lock architecture decisions and close gaps.

**Sub-steps**
- Draft implementation plan; review against scope and structure rules.
- Lock ADRs (server-first, URL list, drawer state/URL, no TanStack, prefetch button, cache split).
- Define URL contract and empty-state types.
- Fill audit expectations (a11y, errors, theme, skeletons) into later steps.

**UX ideas**
- Pending dim on filter/page changes (keep rows, don’t freeze/blank).
- Fast drawer open via local state + optional warm cache; URL remains shareable.

---

## Phase 4 — Initial documentation

**Goal:** Publish shared project docs so structure, phases, and locked decisions are discoverable.

**Sub-steps**
- Add root `docs/` entrypoint and section READMEs.
- Write [initial-file-structure.md](./initial-file-structure.md) and this phases map.
- Document architecture (rendering, state, caching, routing).
- Record ADRs; add concepts (glossary/terminology) and contributing guide.
- Keep a local clean implementation plan at `app/development/project/plan-clean.md` (not committed).

**UX ideas**
- Docs support agents and humans equally: short ADRs, clear phase UX notes, one dependency rule.
- Theme and scope drafts stay under `app/development/` for iteration without polluting the repo history.

---

## Phase 5 — File structure scaffold

**Goal:** Create the empty skeleton so implementation steps have a home.

**Sub-steps**
- Add `views/`, `entities/customer`, `shared/ui` (and thin `app/` routes) per [initial-file-structure.md](./initial-file-structure.md).
- Wire route shells: `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Placeholder API route files for customers list + health.
- Scaffold root `tests/` (`unit/`, `integration/`, `fixtures/`) + README.
- README stubs for new units.

**UX ideas**
- Skeletons in `loading.tsx` already match future row height (~40–44px).
- `not-found` and `error` copy calm and recoverable (theme checklist).

**Testing**
- Folder only — no assertions yet; fixtures folder ready for shared customer data.

---

## Phase 6 — Implementation

**Goal:** Build Customer Health end-to-end in commit-sized steps.

High-level stages (see `plan-clean.md` for the locked checklist):

1. Route shells + theme-aligned chrome  
2. URL contract helpers  
3. Mock/API + entity schemas  
4. Configurable table (mock)  
5. Server list fetch  
6. Pagination (URL) + pending dim  
7. Search (debounce, reset page) + empty states  
8. Segment filter  
9. Multi-level sorting (`sort=field:order,...`)  
10. Details panel shell + state/URL hook  
11. Health data + loading/error/retry + client cache  
12. Prefetch button  
13. App chrome (`AppShell` / sidebar / `AppHeader`)  
14. Overview cards + server aggregates (ADR-007)  
15. Audit pass (a11y, errors, theme, skeletons)

**UX ideas (carry through Phase 6)**
- True empty vs filtered empty messaging.
- Table `aria-busy` / dim while pending; block double-clicks mid-flight; `{ scroll: false }` on param updates.
- Default sort health-then-name when sort params absent (triage-first land).
- Drawer: focus trap, Escape, return focus to trigger; sections with dividers (not nested card stacks).
- Prefetch control clearly named for assistive tech; silent prefetch failure.
- Row keyboard activation to open drawer; selection from `customerId` only.
- Stale search rehydrate; page clamp; concurrent drawer open keyed/cancelled by id.
- Long names / empty cells; reduced motion; narrow full-screen drawer sheet.
- Error taxonomy: user/input vs network vs offline vs unexpected — matching recovery (retry vs fix filters).

**Testing (carry through Phase 6)** — see [guides/testing.md](./guides/testing.md)

*Unit (with the step that introduces the rule)*
- URL parse/serialize + page reset  
- Schemas / transforms (list + health)  
- Drawer hook (mocked router)  
- Health client cache (prefetch hit)

*Integration (three required)*
1. `GET /api/customers` — search, segment, pagination, sort  
2. `GET /api/customers/{id}/health` — happy path + not-found  
3. List wiring — `searchParams` → query → shaped list props  

---

## Status snapshot

| Phase | Status |
|---|---|
| 1 Product brief | Done |
| 2 Design settle | Done (theme doc + globals tuned) |
| 3 Plan and review | Done (ADRs + plan-clean) |
| 4 Initial documentation | Done (`docs/` + root README architecture/structure) |
| 5 File structure scaffold | Done |
| 6 Implementation | Done (list + panel + overview cards + app chrome; Step 13 audit closed with known gaps in plan-clean) |
