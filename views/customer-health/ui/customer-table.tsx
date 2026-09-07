"use client";

/**
 * @file Customer list table wiring — presentation via shared DataTable.
 */

import { DataTable } from "@/shared/ui";

import {
  customerTableColumns,
  customerTableEmptyMessage,
} from "../model/customer-table-columns";
import type { CustomerTableProps } from "../model/customer-table-props";

export function CustomerTable({
  rows = [],
  selectedRowId = null,
  onRowClick,
  isPending,
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
        emptyMessage={customerTableEmptyMessage}
      />
    </section>
  );
}
