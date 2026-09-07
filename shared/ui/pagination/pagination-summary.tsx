"use client";

/**
 * @file Left-side range copy: “Showing X–Y of Z”.
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
    return <p className="tabular-nums">Showing 0 of 0</p>;
  }

  return (
    <p className="tabular-nums">
      Showing{" "}
      <span className="font-medium text-foreground">
        {start}–{end}
      </span>{" "}
      of <span className="font-medium text-foreground">{total}</span>
    </p>
  );
}
