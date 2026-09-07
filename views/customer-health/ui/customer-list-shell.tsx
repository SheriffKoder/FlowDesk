"use client";

/**
 * @file views/customer-health/ui/customer-list-shell.tsx
 *
 * Purpose: Client list island — toolbar, table, pagination, shared pending dim.
 * Used in: `CustomerHealthPage` (server composition shell).
 * Used for: Wire URL list controls (`useListUrl`) into search, segment,
 *   sort headers, `Pagination`, and `CustomerTable` without putting router
 *   logic in the server page.
 *
 * Function Index:
 * - CustomerListShell({ list }) → toolbar + table + pagination
 *
 * Steps:
 * 1. Derive `isPending` / `patchParams` from current parsed URL params.
 * 2. Render search + segment toolbar, sortable table, and pagination footer.
 * 3. Search / segment / sort / page / page_size → `patchParams` → soft-nav.
 */

import { Pagination } from "@/shared/ui";

import { useListUrl } from "../hooks/use-list-url";
import { nextListSort } from "../lib/next-list-sort";
import { customerHealthListConfig } from "../model/list-config";
import type { ListPageSize } from "../model/list-url-params";
import type { CustomerListPageData } from "../server/load-customer-list";
import { CustomerHealthToolbar } from "./customer-health-toolbar";
import { CustomerTable } from "./customer-table";

export type CustomerListShellProps = {
  list: CustomerListPageData;
};

/**
 * Interactive list region: URL-driven search/sort/pagination and shared pending dim.
 * Header stays on the server composition shell above this island.
 */
export function CustomerListShell({ list }: CustomerListShellProps) {
  const { isPending, patchParams } = useListUrl(list.params);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <CustomerHealthToolbar
        search={list.params.search}
        onSearchChange={(search) => {
          patchParams({ search });
        }}
        segment={list.params.segment}
        onSegmentChange={(segment) => {
          patchParams({ segment });
        }}
      />
      <CustomerTable
        rows={list.rows}
        selectedRowId={list.params.customerId}
        emptyKind={list.emptyKind}
        isPending={isPending}
        sorts={list.params.sorts}
        onSortToggle={(key) => {
          patchParams({ sorts: nextListSort(list.params.sorts, key) });
        }}
      />
      <Pagination
        page={list.page}
        pageSize={list.pageSize}
        total={list.total}
        pageSizeOptions={customerHealthListConfig.pagination.sizes}
        isPending={isPending}
        aria-label="Customer list pagination"
        onPageChange={(page) => {
          patchParams({ page });
        }}
        onPageSizeChange={(pageSize) => {
          patchParams({ pageSize: pageSize as ListPageSize });
        }}
      />
    </div>
  );
}
