# Entity — Customer

Domain concept for FlowDesk customers: list rows, health payload, schemas, queries, and client health cache.

**Owns:** types, field catalog, Zod schemas, transforms, repository/queries, health client fetcher + in-memory cache, entity errors.

**Does not own:** page composition, drawer shell chrome, or URL serialization (view `list-config` / shared helpers).

Field catalog + copyable list pages: [docs/architecture/list-field-catalog.md](../../docs/architecture/list-field-catalog.md).

Public API via `index.ts` only.

Folder/file skim map: [docs/responsibilities.md](./docs/responsibilities.md).
