/**
 * @file shared/ui/filter-option-buttons/types.ts
 *
 * Purpose: Prop types for dumb multi/single select option button rows.
 */

export type FilterOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FilterOptionButtonsProps = {
  /** Visible group label (e.g. “Segment”). */
  label: string;
  /** Options rendered as toggle buttons. */
  options: readonly FilterOption[];
  /** Currently selected values (empty = none / “all” for callers). */
  value: readonly string[];
  /** Called with the next selection after a toggle. */
  onChange: (next: string[]) => void;
  /**
   * `multi` toggles membership; `single` selects one or clears if re-clicked.
   * @default "multi"
   */
  selectionMode?: "multi" | "single";
  className?: string;
  /** Hide visible label; keep accessible name on the group. */
  hideLabel?: boolean;
};
