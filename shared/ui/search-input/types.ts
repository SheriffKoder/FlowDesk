/**
 * @file Prop types for the shared SearchInput.
 */

export type SearchInputProps = {
  /** Visible / accessible label (e.g. “Search”). */
  label: string;
  /** Input placeholder. */
  placeholder?: string;
  /**
   * Quiet period before calling `onValueCommit` (ms).
   * @default 300
   */
  debounceMs?: number;
  /**
   * Committed value from the URL (source of truth for *filters*, not the input).
   * Local draft owns typing; this prop only rehydrates on external history changes
   * (back/forward), not on echoes of our own debounced commits.
   */
  value: string;
  /** Called after debounce (or Enter) with the trimmed draft. */
  onValueCommit: (value: string) => void;
  disabled?: boolean;
  className?: string;
  /** Optional id; falls back to a generated id for label association. */
  id?: string;
  /**
   * When true, hide the visible label but keep `aria-label` / htmlFor wiring.
   * @default false
   */
  hideLabel?: boolean;
};
