"use client";

/**
 * @file Customer list table wiring — presentation via shared DataTable.
 * Sortable headers use shared SortButton; multi-level URL sorts stay in the shell.
 */

import { DataTable } from "@/shared/ui";

import {
  buildCustomerTableColumns,
  customerTableFilteredEmptyMessage,
  customerTableTrueEmptyMessage,
} from "../model/customer-table-columns";
import type { CustomerTableProps } from "../model/customer-table-props";

function resolveEmptyMessage(
  emptyKind: CustomerTableProps["emptyKind"],
): string {
  if (emptyKind === "filtered") {
    return customerTableFilteredEmptyMessage;
  }
  return customerTableTrueEmptyMessage;
}

export function CustomerTable({
  rows,
  selectedRowId = null,
  onRowClick,
  isPending,
  emptyKind = null,
  sorts = [],
  onSortToggle,
}: CustomerTableProps) {
  const columns = buildCustomerTableColumns({
    sorts,
    isPending,
    onSortToggle: onSortToggle ?? (() => {}),
    onOpenCustomer: onRowClick,
  });

  return (
    <section
      aria-label="Customer list"
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        selectedRowId={selectedRowId}
        onRowClick={onRowClick}
        isPending={isPending}
        aria-label="Customers"
        emptyMessage={resolveEmptyMessage(emptyKind)}
      />
    </section>
  );
}
