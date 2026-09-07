"use client";

/**
 * @file views/customer-health/ui/customer-list-shell.tsx
 *
 * Purpose: Client list island — toolbar, table, pagination, shared pending dim.
 * Used in: `CustomerHealthPage` (server composition shell).
 * Used for: Wire URL list controls (`useListUrl`) into search, `Pagination`,
 *   and `CustomerTable` without putting router logic in the server page.
 *
 * Function Index:
 * - CustomerListShell({ list }) → toolbar + table + pagination
 *
 * Steps:
 * 1. Derive `isPending` / `patchParams` from current parsed URL params.
 * 2. Render search toolbar, dimmable table, and pagination footer.
 * 3. Search / page / page_size → `patchParams` → soft-nav `{ scroll: false }`.
 */

import { Pagination } from "@/shared/ui";

import { useListUrl } from "../hooks/use-list-url";
import { LIST_PAGE_SIZES, type ListPageSize } from "../model/list-url-params";
import type { CustomerListPageData } from "../server/load-customer-list";
import { CustomerHealthToolbar } from "./customer-health-toolbar";
import { CustomerTable } from "./customer-table";

export type CustomerListShellProps = {
  list: CustomerListPageData;
};

/**
 * Interactive list region: URL-driven search/pagination and shared pending dim.
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
      />
      <CustomerTable
        rows={list.rows}
        selectedRowId={list.params.customerId}
        emptyKind={list.emptyKind}
        isPending={isPending}
      />
      <Pagination
        page={list.page}
        pageSize={list.pageSize}
        total={list.total}
        pageSizeOptions={LIST_PAGE_SIZES}
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
