"use client";

/**
 * @file views/customer-health/hooks/use-list-url.ts
 *
 * Purpose: Client list URL updates with pending transition (scroll: false).
 * Used in: `CustomerListShell` (pagination now; search/segment/sort later).
 * Used for: Shareable query changes without jump-to-top; dim table via `isPending`.
 *
 * Function Index:
 * - useListUrl(params) → { isPending, patchParams }
 *
 * Steps:
 * 1. Merge patch via `applyListParamsPatch` (resets page when filters/size change).
 * 2. Serialize → `router.push` inside `startTransition` with `{ scroll: false }`.
 */

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  applyListParamsPatch,
  serializeListParamsToString,
  type ListParamsPatch,
} from "../lib";
import type { CustomerHealthUrlParams } from "../model/list-url-params";

export type UseListUrlResult = {
  /** True while the App Router soft-navigation for list params is in flight. */
  isPending: boolean;
  /** Apply a typed param patch and push the new URL. */
  patchParams: (patch: ListParamsPatch) => void;
};

/**
 * Drive Customer Health list state from the URL with concurrent pending UX.
 *
 * @param params - Current parsed URL params (from the server list load)
 */
export function useListUrl(params: CustomerHealthUrlParams): UseListUrlResult {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function patchParams(patch: ListParamsPatch): void {
    //////////////////////////////////
    // 1. Merge + page-reset rules (search/segment/sort/size → page 1).
    const next = applyListParamsPatch(params, patch);
    const query = serializeListParamsToString(next);
    const href = query.length > 0 ? `${pathname}?${query}` : pathname;
    //////////////////////////////////

    //////////////////////////////////
    // 2. Soft-navigate without scrolling; keep current rows until RSC settles.
    startTransition(() => {
      router.push(href, { scroll: false });
    });
    //////////////////////////////////
  }

  return { isPending, patchParams };
}
