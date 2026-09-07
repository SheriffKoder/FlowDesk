# View — Customer Health

Route composition for the Customer Health overview page.

**Owns:** page shell wiring (header, toolbar, table, drawer host) and view-local URL helpers once implemented.

**Does not own:** customer domain schemas, API handlers, or shared UI primitives.

Dependency direction: `views → features → entities → shared`.
