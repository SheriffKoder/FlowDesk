"use client";

/**
 * @file Prev / page status / Next controls.
 * Mobile: icon chevrons + “1/2”. Desktop: Previous / Page N of M / Next.
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const navButtonClassName = cn(
  "button-secondary inline-flex h-9 items-center justify-center rounded-md text-sm",
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
  const safePage = Math.min(page, totalPages);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={cn(navButtonClassName, "size-9 px-0 md:w-auto md:px-3")}
        disabled={!canPrev}
        aria-label="Previous page"
        onClick={() => {
          onPageChange(page - 1);
        }}
      >
        <ChevronLeft className="size-4 md:hidden" aria-hidden />
        <span className="hidden md:inline">Previous</span>
      </button>
      <span
        className="min-w-[2.5rem] px-1.5 text-center tabular-nums md:min-w-[6.5rem] md:px-2"
        aria-live="polite"
      >
        <span className="md:hidden">
          {safePage}/{totalPages}
        </span>
        <span className="hidden md:inline">
          Page {safePage} of {totalPages}
        </span>
      </span>
      <button
        type="button"
        className={cn(navButtonClassName, "size-9 px-0 md:w-auto md:px-3")}
        disabled={!canNext}
        aria-label="Next page"
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        <ChevronRight className="size-4 md:hidden" aria-hidden />
        <span className="hidden md:inline">Next</span>
      </button>
    </div>
  );
}
