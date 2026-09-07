# Widget — App sidebar

Slim icon chrome for FlowDesk.

**Owns:** nav config (`url` / `icon` / `disabled` / `label`), desktop rail, mobile bottom dock, `AppShell` frame.

**Does not own:** route pages or feature workflows.

## Layout

| Viewport | Placement | Logo |
|---|---|---|
| `md+` | Left rail (`w-16`) | Fixed-height mark (`h-14`) |
| `<md` | Bottom bar | Hidden; icons scroll horizontally |

## Composition

```
app/layout.tsx
  └─ AppShell
       ├─ AppSidebar variant="rail"   ← desktop
       ├─ {children}
       └─ AppSidebar variant="dock"   ← mobile
```

Nav items live in `model/nav-config.ts` — extend there when adding routes.
