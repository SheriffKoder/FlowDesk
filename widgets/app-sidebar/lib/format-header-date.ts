/**
 * @file widgets/app-sidebar/lib/format-header-date.ts
 *
 * Purpose: Format “today” for the header user area.
 * Used in: `UserArea`.
 * Used for: `Monday 16 Jul 2026` style (weekday day mon year).
 *
 * Function Index:
 * - formatHeaderDate(date?) → string
 */

/**
 * @param date - Date to format (defaults to now)
 * @returns e.g. `Monday 16 Jul 2026`
 */
export function formatHeaderDate(date: Date = new Date()): string {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    date,
  );
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date,
  );
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}
