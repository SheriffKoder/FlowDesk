/**
 * @file views/customer-health/model/overview-cards-config.ts
 *
 * Purpose: Static copy + segment row chrome for overview cards.
 * Used in: `OverviewCardsRow` / segment count loader wiring.
 * Used for: Keep welcome text and segment icons out of dumb card UIs.
 */

import {
  CUSTOMER_SEGMENT_LABELS,
  type CustomerSegment,
} from "@/entities/customer";
import type { StatusBadgeTone } from "@/shared/ui";
import {
  AlertTriangle,
  Eye,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

import { customerHealthListConfig } from "./list-config";

/////////////////////////////////////////////////////////////
// Welcome (demo identity — matches header UserArea for now)
/////////////////////////////////////////////////////////////

export const overviewWelcomeConfig = {
  name: "Alex Rivera",
  description:
    "Your CRM oasis — come back and explore the power of your customer data.",
} as const;

/////////////////////////////////////////////////////////////
// Segment count row chrome
/////////////////////////////////////////////////////////////

export type SegmentCountChrome = {
  label: string;
  tone: StatusBadgeTone;
  icon: LucideIcon;
};

export const segmentCountChrome = {
  healthy: {
    label: CUSTOMER_SEGMENT_LABELS.healthy,
    tone: customerHealthListConfig.segmentBadgeTones.healthy,
    icon: HeartPulse,
  },
  watch: {
    label: CUSTOMER_SEGMENT_LABELS.watch,
    tone: customerHealthListConfig.segmentBadgeTones.watch,
    icon: Eye,
  },
  at_risk: {
    label: CUSTOMER_SEGMENT_LABELS.at_risk,
    tone: customerHealthListConfig.segmentBadgeTones.at_risk,
    icon: AlertTriangle,
  },
} as const satisfies Record<CustomerSegment, SegmentCountChrome>;
