/**
 * @file shared/ui/avatar/types.ts
 *
 * Purpose: Props for the dumb Avatar chip.
 */

export type AvatarProps = {
  /** Display name — used for alt text and initials fallback. */
  name: string;
  /** Optional image URL. When missing / broken, initials are shown. */
  src?: string | null;
  className?: string;
  /**
   * Diameter utility (Tailwind size). Defaults to `size-7` (table-friendly).
   * Example: `size-9` for header chrome.
   */
  sizeClassName?: string;
};
