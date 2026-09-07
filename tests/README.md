# Tests

Root test suite for FlowDesk Customer Health.

```
tests/
├── unit/          # Pure rules: URL contract, schemas/transforms, drawer hook, health cache
├── integration/   # Boundaries: list API, health API, searchParams → list props
└── fixtures/      # Shared customer/health fixtures
```

Runner scripts and first real cases land with later Foundation / Data tickets. See [docs/guides/testing.md](../docs/guides/testing.md).
