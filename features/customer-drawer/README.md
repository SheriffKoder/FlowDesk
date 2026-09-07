# Feature — Customer drawer

Optional workflow slice for the Customer Health detail drawer (`useCustomerDrawer`, host wiring).

Scaffolded early so the drawer hook has a home when Foundation / Drawer tickets land. Keep empty until the hook needs isolation from the view.

**Owns:** drawer open/close workflow, URL mirror/hydrate for `customerId` (when extracted from the view).

**Does not own:** health fetch/cache (entity `client/`), panel chrome primitives (`shared/ui`).
