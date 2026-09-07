"use client";

/**
 * @file Dumb configurable data table — columns, rows, optional row activation.
 * No domain knowledge; callers own column defs and click handlers.
 * Fill a flex parent (`flex-1 min-h-0`); sticky thead, rows scroll underneath.
 */

import { cn } from "@/lib/utils";

import type { DataTableProps } from "./types";

export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  selectedRowId = null,
  emptyMessage = "No results.",
  className,
  isPending = false,
  "aria-label": ariaLabel = "Data table",
}: DataTableProps<T>) {
  const interactive = typeof onRowClick === "function";

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card",
        "motion-safe:transition-opacity motion-safe:duration-150 motion-reduce:transition-none",
        isPending && "pointer-events-none opacity-60",
        className,
      )}
      aria-busy={isPending || undefined}
    >
      {/*
        One scrollport: sticky thead stays put while tbody rows slide under it.
        `border-separate` keeps sticky headers reliable (collapse breaks sticky in browsers).
      */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table
          className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm"
          aria-label={ariaLabel}
        >
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "h-11 border-b border-border bg-muted px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row);
                const selected =
                  selectedRowId != null && selectedRowId === rowId;

                return (
                  <tr
                    key={rowId}
                    data-selected={selected || undefined}
                    tabIndex={interactive ? 0 : undefined}
                    aria-selected={interactive ? selected : undefined}
                    className={cn(
                      "h-11",
                      interactive &&
                        "cursor-pointer hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                      selected && "bg-accent",
                    )}
                    onClick={
                      interactive
                        ? () => {
                            onRowClick(row);
                          }
                        : undefined
                    }
                    onKeyDown={
                      interactive
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          "border-b border-border px-3 text-foreground",
                          column.className,
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
