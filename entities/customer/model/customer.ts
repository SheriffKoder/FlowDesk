/**
 * @file entities/customer/model/customer.ts
 *
 * Purpose: Domain types for customer list rows and health detail.
 * Used in: schemas (z.infer alignment), repository, queries, API responses.
 * Used for: Stable shapes the UI and tests can depend on.
 */

import type { CustomerSegment } from "./segment";

/**
 * One customer in the health overview table.
 */
export type CustomerListItem = {
  id: string;
  name: string;
  /** Domain used for search (name or domain). */
  domain: string;
  /** Monthly recurring revenue in USD. */
  mrr: number;
  /** ISO-8601 timestamp of last activity. */
  lastActive: string;
  /** Health score 0–100 (lower = higher risk). */
  health: number;
  owner: string;
  segment: CustomerSegment;
};

/**
 * Drawer health payload for a single customer.
 */
export type CustomerHealthDetail = {
  customerId: string;
  events: CustomerHealthEvent[];
  usage: CustomerUsagePoint[];
  notes: string;
};

export type CustomerHealthEvent = {
  id: string;
  at: string;
  type: string;
  summary: string;
};

export type CustomerUsagePoint = {
  period: string;
  value: number;
};
