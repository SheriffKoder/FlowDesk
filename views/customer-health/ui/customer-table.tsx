"use client";

/**
 * @file Customer list table wiring — presentation via shared DataTable.
 */

import { DataTable } from "@/shared/ui";

import {
  customerTableColumns,
  customerTableFilteredEmptyMessage,
  customerTableTrueEmptyMessage,
} from "../model/customer-table-columns";
import type { CustomerTableProps } from "../model/customer-table-props";


// Helper function to resolve the empty message based on the empty kind.
function resolveEmptyMessage(
  emptyKind: CustomerTableProps["emptyKind"],
): string {

  // If the empty kind is filtered, return the filtered empty message.
  if (emptyKind === "filtered") {
    return customerTableFilteredEmptyMessage;
  }
  // Otherwise, return the true empty message.
  return customerTableTrueEmptyMessage;
}

// Customer table component.
export function CustomerTable({
  rows,
  selectedRowId = null,
  onRowClick,
  isPending,
  emptyKind = null,
}: CustomerTableProps) {
  return (
    <section aria-label="Customer list" className="min-w-0">
      <DataTable
        columns={customerTableColumns}
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
