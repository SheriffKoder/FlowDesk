"use client";

/**
 * @file views/customer-health/ui/customer-list-shell.tsx
 *
 * Purpose: Client list island — toolbar, table, pagination, details panel.
 * Used in: `CustomerHealthPage` (server composition shell).
 * Used for: Wire URL list controls + customer details open beside the table.
 *
 * Function Index:
 * - CustomerListShell({ list }) → data widget / details / pagination
 *
 * Steps:
 * 1. Derive `isPending` / `patchParams` from current parsed URL params.
 * 2. `useCustomerDrawer` — local open first; mirror `customerId` via patch.
 * 3. Toolbar + table share one widget surface; details panel is a sibling
 *    widget; pagination stays full-width below.
 */

import { cn } from "@/lib/utils";
import {
  CustomerDetailsPanel,
  useCustomerDrawer,
} from "@/features/customer-drawer";
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
 * Interactive list region: URL-driven controls + in-layout customer details.
 * Header stays on the server composition shell above this island.
 */
export function CustomerListShell({ list }: CustomerListShellProps) {
  const { isPending, patchParams } = useListUrl(list.params);
  const drawer = useCustomerDrawer({
    urlCustomerId: list.params.customerId,
    onMirrorCustomerId: (customerId) => {
      patchParams({ customerId });
    },
  });

  const selectedRow =
    drawer.customerId == null
      ? undefined
      : list.rows.find((row) => row.id === drawer.customerId);
  const detailsTitle = selectedRow?.name ?? "Customer details";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 gap-4">
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-widget-border bg-widget text-widget-foreground",
            drawer.open && "max-lg:hidden",
          )}
        >
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
            selectedRowId={drawer.selectedCustomerId}
            emptyKind={list.emptyKind}
            isPending={isPending}
            sorts={list.params.sorts}
            onSortToggle={(key) => {
              patchParams({ sorts: nextListSort(list.params.sorts, key) });
            }}
            onRowClick={(row) => {
              drawer.openCustomer(row.id);
            }}
          />
        </div>

        <CustomerDetailsPanel
          open={drawer.open}
          customerId={drawer.customerId}
          title={detailsTitle}
          onClose={drawer.close}
          className={cn(
            "w-full shrink-0",
            "lg:w-[28rem]",
            drawer.open && "max-lg:flex-1",
          )}
        />
      </div>

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
