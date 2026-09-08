# Avatar

Circular identity chip: image when `src` is set, otherwise a muted full-round circle with initials from `name` (e.g. `Alex Rivera` → `AR`).

| Export | Role |
|---|---|
| `Avatar` | Presentational chip |
| `getInitials` | Pure name → initials helper |
| `AvatarProps` | `name`, optional `src`, size / className |

Broken image URLs fall back to initials via `onError`.
