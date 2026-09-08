/**
 * @file Server composition shell for Customer Health.
 * Canvas page + overview cards + list surface; details panel opens in-layout.
 * Page title/description live in layout `AppHeader` (widgets/app-sidebar).
 *
 * Mobile: natural document height (shell content scrolls).
 * Desktop (`md+`): fill shell height so the table/details nest-scroll.
 */

import type { CustomerListPageData } from "../server/load-customer-list";
import type { OverviewCardsData } from "../server/load-overview-cards";
import { OverviewCardsRow } from "./cards";
import { CustomerListShell } from "./customer-list-shell";

export type CustomerHealthPageProps = {
  list: CustomerListPageData;
  overview: OverviewCardsData;
};

export function CustomerHealthPage({
  list,
  overview,
}: CustomerHealthPageProps) {
  return (
    <div className="flex flex-col md:h-full md:min-h-0 md:overflow-hidden">
      <main className="mx-auto flex w-full flex-col px-6 pb-6 pt-8 md:min-h-0 md:flex-1 md:overflow-hidden">
        <div className="flex flex-col gap-4 md:min-h-0 md:flex-1 md:overflow-hidden">
          <OverviewCardsRow
            welcomeMetrics={overview.welcomeMetrics}
            segmentCounts={overview.segmentCounts}
          />
          <CustomerListShell list={list} />
        </div>
      </main>
    </div>
  );
}
