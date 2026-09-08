"use client";

/**
 * @file Dumb pagination footer — composes summary + controls.
 * No router / URL knowledge; callers wire navigation (e.g. list URL + useTransition).
 */

import { cn } from "@/lib/utils";

import { PaginationControls } from "./pagination-controls";
import { getPaginationRange } from "./pagination-range";
import { PaginationSummary } from "./pagination-summary";
import type { PaginationProps } from "./types";

export function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  isPending = false,
  className,
  "aria-label": ariaLabel = "Pagination",
}: PaginationProps) {
  const { start, end, totalPages } = getPaginationRange(page, pageSize, total);
  const canPrev = page > 1 && !isPending;
  const canNext = page < totalPages && !isPending;

  return (
    <nav
      aria-label={ariaLabel}
      aria-busy={isPending || undefined}
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-3 pt-3 text-sm text-muted-foreground",
        isPending && "pointer-events-none opacity-60",
        "motion-safe:transition-opacity motion-safe:duration-150 motion-reduce:transition-none",
        className,
      )}
    >
      <PaginationSummary start={start} end={end} total={total} />
      <PaginationControls
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        pageSizeOptions={pageSizeOptions}
        canPrev={canPrev}
        canNext={canNext}
        disabled={isPending}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </nav>
  );
}
