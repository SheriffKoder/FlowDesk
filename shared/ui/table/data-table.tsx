"use client";

/**
 * @file Dumb configurable data table — columns, rows, optional row activation.
 * No domain knowledge; callers own column defs and click handlers.
 * Fill a flex parent (`flex-1 min-h-0`); sticky thead, rows scroll underneath.
 * Visual chrome lives in `app/globals.css` (`.data-table*`); no own surface/border.
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
        "data-table-root",
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
      <div className="custom-scrollbar min-h-0 flex-1 overflow-auto">
        <table className="data-table" aria-label={ariaLabel}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={column.ariaSort}
                  className={column.headerClassName}
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
                    data-interactive={interactive || undefined}
                    tabIndex={interactive ? 0 : undefined}
                    aria-selected={interactive ? selected : undefined}
                    className={cn(
                      interactive &&
                        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
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
                      <td key={column.id} className={column.className}>
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
