/**
 * @file Thin App Router entry for Customer Health.
 * Composition lives in `views/customer-health`.
 */

import type { Metadata } from "next";
import { CustomerHealthPage } from "@/views/customer-health";

export const metadata: Metadata = {
  title: "Customer Health | FlowDesk",
  description:
    "See which accounts are healthy and which need attention so you can prioritize outreach.",
};

export default function Page() {
  return <CustomerHealthPage />;
}
