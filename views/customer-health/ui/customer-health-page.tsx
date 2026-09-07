/**
 * @file Server composition shell for Customer Health.
 * Canvas page + surface table; details panel opens in-layout beside the list.
 */

import type { CustomerListPageData } from "../server/load-customer-list";
import { CustomerListShell } from "./customer-list-shell";
import { PageHeader } from "./page-header";

export type CustomerHealthPageProps = {
  list: CustomerListPageData;
};

export function CustomerHealthPage({ list }: CustomerHealthPageProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-12">
        <PageHeader />
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <CustomerListShell list={list} />
        </div>
      </main>
    </div>
  );
}
