# FlowDesk docs

Application-wide documentation for FlowDesk (Customer Health overview and related work).

| Section | Purpose |
|---|---|
| [initial-file-structure.md](./initial-file-structure.md) | Target folder layout and layer rules |
| [project-phases.md](./project-phases.md) | Phase labels, steps, and UX ideas |
| [architecture/](./architecture/) | How rendering, state, cache, and routing fit together |
| [adr/](./adr/) | Architecture Decision Records (locked choices) |
| [concepts/](./concepts/) | Glossary and shared terminology |
| [guides/](./guides/) | How to contribute, test, and work in this repo |

**Working plan (local, not committed):** `app/development/project/plan-clean.md` — implementation steps and locked decisions for agents.  
**Theme / scope drafts (local):** `app/development/project/`.

Dependency direction (never reverse):

```
views → features → entities → shared
```
