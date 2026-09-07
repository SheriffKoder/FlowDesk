# Tests

Root test suite for FlowDesk Customer Health.

```
tests/
├── unit/          # Pure rules: URL contract, schemas/transforms, drawer hook, health cache
├── integration/   # Boundaries: list API, health API, searchParams → list props
└── fixtures/      # Shared customer/health fixtures
```

**Runner:** Vitest (`npm test` / `npm run test:watch`).

| Path | Status |
|---|---|
| `tests/unit/list-url-params.test.ts` | Landed — URL parse/serialize, defaults, page reset, clamp |
| Integration + fixtures | Expected with Data & API tickets |

See [docs/guides/testing.md](../docs/guides/testing.md).
