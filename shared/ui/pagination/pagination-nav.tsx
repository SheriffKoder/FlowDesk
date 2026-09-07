"use client";

/**
 * @file Prev / page status / Next controls.
 */

import { cn } from "@/lib/utils";

const navButtonClassName = cn(
  "h-9 rounded-md border border-border bg-card px-3 text-foreground",
  "hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "disabled:cursor-not-allowed disabled:opacity-40",
);

export type PaginationNavProps = {
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationNav({
  page,
  totalPages,
  canPrev,
  canNext,
  onPageChange,
}: PaginationNavProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={navButtonClassName}
        disabled={!canPrev}
        aria-label="Previous page"
        onClick={() => {
          onPageChange(page - 1);
        }}
      >
        Previous
      </button>
      <span
        className="min-w-[6.5rem] px-2 text-center tabular-nums"
        aria-live="polite"
      >
        Page {Math.min(page, totalPages)} of {totalPages}
      </span>
      <button
        type="button"
        className={navButtonClassName}
        disabled={!canNext}
        aria-label="Next page"
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}
