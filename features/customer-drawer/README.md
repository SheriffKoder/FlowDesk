# Feature — Customer details panel

Workflow for opening customer details **beside** the Customer Health list (in-layout `DetailsPanel`, not an overlay drawer).

**Owns:** open/close workflow (`useCustomerDrawer`), URL mirror/hydrate for `customerId`, feature chrome (`CustomerDetailsPanel`).

**Does not own:** health fetch/cache (entity `client/`), shared panel primitives (`shared/ui/details-panel`), list URL parse/serialize (view).

## Composition

```
CustomerListShell
  useCustomerDrawer({ urlCustomerId, onMirrorCustomerId: patchParams })
  ├─ list column (toolbar / table / pagination)
  └─ CustomerDetailsPanel → DetailsPanel
```

## Rules (ADR-003)

1. Local state opens the panel immediately; URL `customerId` mirrors afterward.
2. Cold load / back-forward with `customerId` hydrates open state.
3. Row selection = open `customerId` only (no duplicate selected-row store).

Health body sections land in the next ticket (Step 11).
