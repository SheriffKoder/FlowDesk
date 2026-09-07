# FlowDesk — Customer Health

FlowDesk is a SaaS product that gives customer success teams a **360° view of their customers**.

This repository implements the **Customer Health Overview** page: a place for CSMs to see which accounts are healthy and which are at risk, so they can prioritize their time.

**Stack:** React, Next.js (App Router), TypeScript, Tailwind CSS, and a shared UI component set.

**APIs:**

```
GET /api/customers?search=&segment=&page=&page_size=
GET /api/customers/{id}/health
```

### What CSMs can do

1. Browse a **sortable table** of customers (name, MRR, last active, health score, owner).
2. Open a **right-side drawer** for recent events, usage trends, and notes.
3. **Filter** by health segment (Healthy / Watch / At Risk) and **search** by name or domain.

The table uses **server-side pagination**. Loading and error states stay consistent with the design system. The route prefers **Server Components**, with client islands only where interaction requires them.

---

## Documentation

| | |
|---|---|
| **File structure** | [docs/initial-file-structure.md](./docs/initial-file-structure.md) |
| **Architectural decisions** | [docs/adr/](./docs/adr/) |
| **Architecture** | [docs/architecture/](./docs/architecture/) |
| **Project phases** | [docs/project-phases.md](./docs/project-phases.md) |
| **Docs index** | [docs/](./docs/) |

**Concepts**

| | |
|---|---|
| Glossary | [docs/concepts/glossary.md](./docs/concepts/glossary.md) |
| Terminology | [docs/concepts/terminology.md](./docs/concepts/terminology.md) |

**Guides**

| | |
|---|---|
| Contributing | [docs/guides/contributing.md](./docs/guides/contributing.md) |
| Testing | [docs/guides/testing.md](./docs/guides/testing.md) |

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
