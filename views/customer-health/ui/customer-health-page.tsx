/**
 * @file Server composition shell for Customer Health.
 * Canvas page + surface table; no decorative card wrapping the whole page.
 */

import { CustomerDrawerHost } from "./customer-drawer-host";
import { CustomerHealthToolbar } from "./customer-health-toolbar";
import { CustomerTable } from "./customer-table";
import { PageHeader } from "./page-header";

export function CustomerHealthPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 pb-12 pt-12">
        <PageHeader />
        <div className="mt-6 flex flex-col gap-4">
          <CustomerHealthToolbar />
          <CustomerTable />
        </div>
      </main>
      <CustomerDrawerHost />
    </div>
  );
}
