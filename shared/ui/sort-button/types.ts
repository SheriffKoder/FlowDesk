/**
 * @file Props for the shared header sort toggle.
 */

export type SortDirection = "asc" | "desc";

export type SortButtonProps = {
  /**
   * Active direction for this column, or `null` when this column is not in
   * the explicit URL sorts (default triage order does not light arrows).
   */
  direction: SortDirection | null;
  /** Human label used in aria-label / title (e.g. column name). */
  label: string;
  /** Cycle none → asc → desc → remove (caller owns URL / state). */
  onToggle: () => void;
  className?: string;
  /** Disable while a list soft-nav is pending. */
  disabled?: boolean;
  /**
   * 0-based multi-level priority when this column is active.
   * `null` / omit → no priority badge.
   */
  priority?: number | null;
};
