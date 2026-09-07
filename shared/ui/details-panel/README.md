# DetailsPanel

Dumb **in-layout** details shell — not a modal overlay.

```
DetailsPanel
├─ header (title + close)
└─ scrollable children
```

## Props

| Prop | Role |
|---|---|
| `open` | When false, renders `null` |
| `title` | Heading + `aria-labelledby` |
| `onClose` | Close button + Escape |
| `children` | Body (loading / sections owned by caller) |
| `className` | Width / flex placement (caller owns layout) |

## A11y

- `role="dialog"` + `aria-modal="true"` while open (focus is trapped).
- Escape closes; Tab cycles inside the panel.
- On close, focus returns to the element that had focus when the panel opened (typically the table row).

## Layout note

Place as a flex sibling of the list (e.g. `w-full lg:w-[28rem]`). Narrow viewports may hide the list and let the panel fill the workspace — that is a page concern, not this shell.
