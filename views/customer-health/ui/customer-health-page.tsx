/**
 * @file Server composition shell for Customer Health.
 * Canvas page + surface table; details panel opens in-layout beside the list.
 * Page title/description live in layout `AppHeader` (widgets/app-sidebar).
 */

import type { CustomerListPageData } from "../server/load-customer-list";
import { CustomerListShell } from "./customer-list-shell";

export type CustomerHealthPageProps = {
  list: CustomerListPageData;
};

export function CustomerHealthPage({ list }: CustomerHealthPageProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col px-6 pb-6 pt-8">
        <div className="flex min-h-0 flex-1 flex-col">
          <CustomerListShell list={list} />
        </div>
      </main>
    </div>
  );
}
