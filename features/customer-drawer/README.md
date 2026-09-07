# Feature — Customer details panel

Workflow for opening customer details **beside** the Customer Health list (in-layout `DetailsPanel`, not an overlay drawer).

**Owns:** open/close workflow (`useCustomerDrawer`), URL mirror/hydrate for `customerId`, health load UI (`useCustomerHealth` + sectioned body), feature chrome (`CustomerDetailsPanel`).

**Does not own:** health HTTP + tab cache (entity `client/`), shared panel primitives (`shared/ui/details-panel`), list URL parse/serialize (view).

## Composition

```
CustomerListShell
  useCustomerDrawer({ urlCustomerId, onMirrorCustomerId: patchParams })
  ├─ list column (toolbar / table / pagination)
  └─ CustomerDetailsPanel(customerId)
       useCustomerHealth → fetchCustomerHealth (cache-first)
       ├─ CustomerHealthBodySkeleton
       ├─ CustomerHealthError (+ Retry)
       └─ CustomerHealthBody (events / usage / notes)
```

## Rules (ADR-003 / ADR-006)

1. Local state opens the panel immediately; URL `customerId` mirrors afterward.
2. Cold load / back-forward with `customerId` hydrates open state.
3. Row selection = open `customerId` only (no duplicate selected-row store).
4. Health fetch is panel-local — errors never trip route `error.tsx`.
5. Rapid row switches abort in-flight requests; UI is keyed by id (no wrong-customer flash).
6. Revisit / prefetch hits the same entity tab cache.
