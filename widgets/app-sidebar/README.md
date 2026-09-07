# Widget — App sidebar

App chrome for FlowDesk: icon rail, mobile dock, and layout header.

**Owns:** page config (`icon` / `label` / `description` / `url`), `getCurrentPage`, desktop rail, mobile dock, `AppHeader`, `AppShell` frame.

**Does not own:** route pages or feature workflows.

## Layout

| Viewport | Placement | Logo |
|---|---|---|
| `md+` | Left rail (`w-20`) | Fixed-height mark (`h-20`, matches header) |
| `<md` | Bottom bar | Hidden; larger icons, `justify-around` |

Top `AppHeader` shares `h-20` + `border-border/40` + `bg-background` with the rail mark (see `model/chrome.ts`). Trailing: `HeaderActions` (inline on `md+`, `⋯` dropdown on mobile) → vertical spacer → `UserArea` (demo name + live date).

## Composition

```
app/layout.tsx
  └─ AppShell
       ├─ AppSidebar variant="rail"   ← desktop
       ├─ column
       │    ├─ AppHeader              ← icon + h1 + description from URL
       │    └─ {children}
       └─ AppSidebar variant="dock"   ← mobile
```

Pages live in `model/page-config.ts`. Nav items are derived for the sidebar; the header resolves the active page via `lib/get-current-page.ts`.
