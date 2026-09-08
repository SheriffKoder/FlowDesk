/**
 * @file shared/ui/status-badge/lib/color-map.ts
 *
 * Purpose: Domain-agnostic status badge tone → Tailwind class maps.
 * Used in: StatusBadge UI, list cells (e.g. customer segment).
 * Used for: Keep pill chrome + semantic colors reusable (not invoice-specific).
 *
 * Theme tokens (@app/globals.css):
 * | Token                    | Light     | Dark (emerald / yellow / red) |
 * | --color-success          | #2ea043   | #34d399                       |
 * | --color-success-light    | #ddf6e3   | #064e3b71                     |
 * | --color-warning          | #d97706   | #facc15                       |
 * | --color-warning-light    | #fff4e5   | #713f1289                     |
 * | --color-error            | #dc4c3e   | #f25f5c                       |
 * | --color-error-light      | #fdecec   | #f25f5c33 (~20% opacity)      |
 *
 * Function Index:
 * - STATUS_BADGE_TONE_CLASS — fill + label color per tone
 * - STATUS_BADGE_PILL_CLASS — shared pill chrome
 * - STATUS_BADGE_DOT_CLASS — leading status dot
 * - statusBadgeClassName(tone) — tone + pill merged for a single className
 *
 * Theme tokens (`app/globals.css`): `--color-success`, `--color-success-light`,
 * `--color-warning`, `--color-warning-light`, `--color-error`, `--color-error-light`.
 */

import { cn } from "@/lib/utils";

/////////////////////////////////////////////////////////////
// Tones — general semantics (map domain enums at the call site)
/////////////////////////////////////////////////////////////

export const STATUS_BADGE_TONES = [
  "success",
  "warning",
  "error",
  "neutral",
] as const;

export type StatusBadgeTone = (typeof STATUS_BADGE_TONES)[number];

/**
 * Semantic fill + text for each tone.
 * Call sites map their domain status → tone (e.g. healthy → success).
 */
export const STATUS_BADGE_TONE_CLASS: Record<StatusBadgeTone, string> = {
  success:
    "bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning:
    "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  error: "bg-[var(--color-error-light)] text-[var(--color-error)]",
  neutral: "bg-muted text-muted-foreground",
};

/////////////////////////////////////////////////////////////
// Pill chrome
/////////////////////////////////////////////////////////////

/** Shared pill layout — combine with {@link STATUS_BADGE_TONE_CLASS}. */
export const STATUS_BADGE_PILL_CLASS =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";

/** Leading status dot — uses `currentColor` from the tone text. */
export const STATUS_BADGE_DOT_CLASS =
  "size-1.5 shrink-0 rounded-full bg-current opacity-80";

/**
 * Merge pill chrome + tone colors into one className.
 *
 * @param tone - Semantic tone (not a domain-specific status)
 * @param className - Optional extra classes
 */
export function statusBadgeClassName(
  tone: StatusBadgeTone,
  className?: string,
): string {
  return cn(
    STATUS_BADGE_PILL_CLASS,
    STATUS_BADGE_TONE_CLASS[tone],
    className,
  );
}
