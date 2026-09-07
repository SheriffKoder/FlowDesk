/**
 * @file Server composition shell for Customer Health.
 * Canvas page + surface table; no decorative card wrapping the whole page.
 */

import type { CustomerListPageData } from "../server/load-customer-list";
import { CustomerDrawerHost } from "./customer-drawer-host";
import { CustomerHealthToolbar } from "./customer-health-toolbar";
import { CustomerTable } from "./customer-table";
import { PageHeader } from "./page-header";

export type CustomerHealthPageProps = {
  list: CustomerListPageData;
};

export function CustomerHealthPage({ list }: CustomerHealthPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 pb-12 pt-12">
        <PageHeader />
        <div className="mt-6 flex flex-col gap-4">
          <CustomerHealthToolbar />
          <CustomerTable
            rows={list.rows}
            selectedRowId={list.params.customerId}
            emptyKind={list.emptyKind}
          />
        </div>
      </main>
      <CustomerDrawerHost />
    </div>
  );
}
