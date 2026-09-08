/**
 * @file Thin App Router entry for Customer Health.
 * Composition lives in `views/customer-health`.
 */

import type { Metadata } from "next";

import {
  CustomerHealthPage,
  loadCustomerList,
  loadOverviewCards,
} from "@/views/customer-health";

export const metadata: Metadata = {
  title: "Customer Health | FlowDesk",
  description:
    "See which accounts are healthy and which need attention so you can prioritize outreach.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const raw = await searchParams;
  const list = loadCustomerList(raw);
  const overview = loadOverviewCards();

  return <CustomerHealthPage list={list} overview={overview} />;
}
