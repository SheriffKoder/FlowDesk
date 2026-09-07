# Entity — Customer

Domain concept for FlowDesk customers: list rows, health payload, schemas, queries, and client health cache.

**Owns:** types, Zod schemas, transforms, repository/queries, health client fetcher + in-memory cache, entity errors.

**Does not own:** page composition, drawer shell chrome, or URL serialization (view/shared helpers).

Public API via `index.ts` only.

Folder/file skim map: [docs/responsibilities.md](./docs/responsibilities.md).
