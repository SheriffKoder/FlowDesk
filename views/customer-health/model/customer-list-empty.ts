/**
 * @file Empty-state kinds for the Customer Health list table.
 *
 * Shared by the server loader and table wiring so `model/` never imports
 * `server/` (dependency stays server → model, not the reverse).
 */

/**
 * How to phrase the empty table when there are no rows:
 * - `true` — no customers at all (no search/segment)
 * - `filtered` — filters/search matched nothing
 * - `null` — table has rows (message unused)
 */
export type CustomerListEmptyKind = "true" | "filtered" | null;
