# StatusBadge

Dumb status pill: leading dot + label + semantic tone colors.

## Maps (`lib/status-badge.ts`)

| Export | Role |
|---|---|
| `StatusBadgeTone` | `success` \| `warning` \| `error` \| `neutral` |
| `STATUS_BADGE_TONE_CLASS` | Fill + text per tone (`--color-*` tokens) |
| `STATUS_BADGE_PILL_CLASS` | Shared pill chrome |
| `STATUS_BADGE_DOT_CLASS` | Leading `bg-current` dot |
| `statusBadgeClassName(tone)` | Pill + tone merged |

Domain enums (segment, invoice status, …) map to a tone at the **call site** — this slice stays domain-agnostic.

## Theme tokens

Defined in `app/globals.css` (`:root` + `.dark`): `--color-success`, `--color-success-light`, `--color-warning`, `--color-warning-light`, `--color-error`, `--color-error-light`.
