/**
 * @file shared/ui/avatar/lib/initials.ts
 *
 * Purpose: Derive compact initials from a display name.
 * Used in: Avatar fallback when no image URL is provided.
 * Used for: "Alex Rivera" → "AR", "Madonna" → "MA".
 *
 * Function Index:
 * - getInitials(name) → 1–2 uppercase letters (or "?")
 */

/**
 * Build avatar initials from a person / org display name.
 *
 * Rules:
 * 1. Split on whitespace; take first letter of first + last token when ≥2 words.
 * 2. Single word → first two letters (or one if only one character).
 * 3. Empty / punctuation-only → "?".
 */
export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    const word = parts[0]!.replace(/[^A-Za-z0-9]/g, "");
    if (word.length === 0) {
      return "?";
    }
    return word.slice(0, 2).toUpperCase();
  }

  const first = parts[0]!.replace(/[^A-Za-z0-9]/g, "").charAt(0);
  const last = parts[parts.length - 1]!
    .replace(/[^A-Za-z0-9]/g, "")
    .charAt(0);

  if (!first && !last) {
    return "?";
  }

  return `${first}${last}`.toUpperCase();
}
