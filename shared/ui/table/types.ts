/**
 * @file Column + props types for the shared configurable table.
 */

import type { ReactNode } from "react";

export type TableColumnDef<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  columns: TableColumnDef<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Highlights the row matching this id (e.g. open drawer `customerId`). */
  selectedRowId?: string | null;
  emptyMessage?: ReactNode;
  className?: string;
  /** Dim rows while a list navigation is pending. */
  isPending?: boolean;
  "aria-label"?: string;
};
