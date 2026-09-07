/**
 * @file widgets/app-sidebar/lib/get-current-page.ts
 *
 * Purpose: Resolve the active {@link AppPageConfig} from a pathname.
 * Used in: `AppHeader` (and any chrome that needs the current page).
 * Used for: Longest-prefix match against `appPages` URLs.
 *
 * Function Index:
 * - getCurrentPage(pathname) → AppPageConfig | undefined
 *
 * Steps:
 * 1. Normalize pathname (trim trailing slash except root).
 * 2. Collect pages whose url matches exactly or as a path prefix.
 * 3. Prefer the longest matching url (most specific page).
 */

import { appPages, type AppPageConfig } from "../model/page-config";

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function pathMatches(pathname: string, pageUrl: string): boolean {
  const path = normalizePathname(pathname);
  const url = normalizePathname(pageUrl);

  if (url === "/") {
    return path === "/";
  }

  return path === url || path.startsWith(`${url}/`);
}

/**
 * Find the page config for the current URL.
 *
 * @param pathname - Current path (e.g. from `usePathname()`)
 * @returns Matching page or `undefined` when unknown
 */
export function getCurrentPage(
  pathname: string,
): AppPageConfig | undefined {
  //////////////////////////////////
  // 1–2. Candidates whose url matches this path.
  const matches = appPages.filter((page) => pathMatches(pathname, page.url));
  //////////////////////////////////

  if (matches.length === 0) {
    return undefined;
  }

  //////////////////////////////////
  // 3. Longest url wins (e.g. `/customers/health` over `/customers`).
  return matches.reduce((best, page) =>
    page.url.length > best.url.length ? page : best,
  );
  //////////////////////////////////
}
