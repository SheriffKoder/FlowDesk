"use client";

/**
 * @file Dumb configurable data table — columns, rows, optional row activation.
 * No domain knowledge; callers own column defs and click handlers.
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
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          "overflow-x-auto rounded-lg border border-border bg-card",
          isPending && "pointer-events-none opacity-60",
        )}
        aria-busy={isPending || undefined}
      >
        <table
          className="w-full min-w-[40rem] border-collapse text-left text-sm"
          aria-label={ariaLabel}
        >
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "h-11 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
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
                      "h-11 border-b border-border last:border-b-0",
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
                        className={cn("px-3 text-foreground", column.className)}
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
