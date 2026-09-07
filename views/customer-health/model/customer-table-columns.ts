/**
 * @file Column definitions for the Customer Health list table.
 */

import type { TableColumnDef } from "@/shared/ui";

import type { CustomerListRow } from "./customer-list-row";

export const customerTableColumns: TableColumnDef<CustomerListRow>[] = [
  {
    id: "name",
    header: "Name",
    cell: (row) => row.name,
  },
  {
    id: "mrr",
    header: "MRR",
    cell: (row) => row.mrr,
    className: "tabular-nums",
  },
  {
    id: "lastActive",
    header: "Last active",
    cell: (row) => row.lastActive,
    className: "text-muted-foreground",
  },
  {
    id: "health",
    header: "Health",
    cell: (row) => row.health,
    className: "font-medium tabular-nums",
  },
  {
    id: "owner",
    header: "Owner",
    cell: (row) => row.owner,
  },
  {
    id: "segment",
    header: "Segment",
    cell: (row) => row.segment,
  },
];

export const customerTableEmptyMessage =
  "Table rows land when list data is wired.";
