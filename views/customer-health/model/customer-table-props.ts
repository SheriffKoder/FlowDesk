/**
 * @file Props for the Customer Health list table wiring component.
 */

import type { CustomerListEmptyKind } from "./customer-list-empty";
import type { CustomerListRow } from "./customer-list-row";

export type CustomerTableProps = {
  rows: CustomerListRow[];
  selectedRowId?: string | null;
  onRowClick?: (row: CustomerListRow) => void;
  isPending?: boolean;
  /** Server-resolved empty kind; drives true vs filtered copy. */
  emptyKind?: CustomerListEmptyKind;
};
