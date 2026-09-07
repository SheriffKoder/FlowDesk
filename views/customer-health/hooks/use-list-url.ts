"use client";

/**
 * @file views/customer-health/hooks/use-list-url.ts
 *
 * Purpose: Client list URL updates with pending transition (scroll: false).
 * Used in: `CustomerListShell` (search + segment + sort + pagination).
 * Used for: Shareable query changes without jump-to-top; dim table via delayed
 *   `isPending` so fast/cached soft-nav does not flicker opacity.
 *
 * Function Index:
 * - useListUrl(params) → { isPending, patchParams }
 *
 * Steps:
 * 1. Merge patch via `applyListParamsPatch` (resets page when filters/size change).
 * 2. Serialize → `router.push` inside `startTransition` with `{ scroll: false }`.
 * 3. Expose delayed pending (default 200ms) for table/pagination dim.
 */

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { useDelayedPending } from "@/shared/hooks";

import {
  applyListParamsPatch,
  serializeListParamsToString,
  type ListParamsPatch,
} from "../lib";
import type { CustomerHealthUrlParams } from "../model/list-url-params";

export type UseListUrlResult = {
  /**
   * True after pending has lasted past the dim delay (not raw `useTransition`).
   * Fast soft-nav finishes before the delay → stays false → no flicker.
   */
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
  const [rawPending, startTransition] = useTransition();
  const isPending = useDelayedPending(rawPending);

  function patchParams(patch: ListParamsPatch): void {
    //////////////////////////////////
    // 1. Merge + page-reset rules (search/segment/sort/size → page 1).
    const next = applyListParamsPatch(params, patch);
    const query = serializeListParamsToString(next);
    const href = query.length > 0 ? `${pathname}?${query}` : pathname;
    //////////////////////////////////

    //////////////////////////////////
    // 2. Soft-navigate without scrolling.
    // Details `customerId` alone must not dim the table — panel opens from
    // local state; URL is only a mirror (ADR-003).
    const onlyCustomerId =
      Object.keys(patch).length === 1 && patch.customerId !== undefined;

    if (onlyCustomerId) {
      router.push(href, { scroll: false });
      return;
    }

    startTransition(() => {
      router.push(href, { scroll: false });
    });
    //////////////////////////////////
  }

  return { isPending, patchParams };
}
