"use client";

/**
 * @file Left-side range copy.
 * Mobile: “1–20 of 40”. Desktop: “Showing 1–20 of 40”.
 */

export type PaginationSummaryProps = {
  start: number;
  end: number;
  total: number;
};

export function PaginationSummary({
  start,
  end,
  total,
}: PaginationSummaryProps) {
  if (total <= 0) {
    return (
      <p className="tabular-nums">
        <span className="md:hidden">0 of 0</span>
        <span className="hidden md:inline">Showing 0 of 0</span>
      </p>
    );
  }

  const range = (
    <>
      <span className="font-medium text-foreground">
        {start}–{end}
      </span>{" "}
      of <span className="font-medium text-foreground">{total}</span>
    </>
  );

  return (
    <p className="tabular-nums">
      <span className="md:hidden">{range}</span>
      <span className="hidden md:inline">Showing {range}</span>
    </p>
  );
}
