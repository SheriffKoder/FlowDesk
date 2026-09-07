/**
 * @file tests/fixtures/customer-health.ts
 *
 * Purpose: Seed per-customer health drawer payloads.
 * Used in: entities/customer/repository, tests/unit, tests/integration.
 * Used for: Happy-path health responses keyed by customer id.
 */

import type { CustomerHealthDetail } from "@/entities/customer/model/customer";

import { customerListFixture } from "./customers";

/**
 * Build a deterministic health payload for each list fixture customer.
 */
function buildHealth(customerId: string, name: string): CustomerHealthDetail {
  return {
    customerId,
    events: [
      {
        id: `${customerId}_evt_1`,
        at: "2026-09-06T12:00:00.000Z",
        type: "login",
        summary: `${name} team signed in`,
      },
      {
        id: `${customerId}_evt_2`,
        at: "2026-09-04T09:30:00.000Z",
        type: "ticket",
        summary: "Support ticket updated",
      },
    ],
    usage: [
      { period: "2026-W35", value: 42 },
      { period: "2026-W36", value: 51 },
    ],
    notes: `CSM notes for ${name}.`,
  };
}

/** Health payloads keyed by customer id (covers every list fixture id). */
export const customerHealthFixtureById: Record<string, CustomerHealthDetail> =
  Object.fromEntries(
    customerListFixture.map((customer) => [
      customer.id,
      buildHealth(customer.id, customer.name),
    ]),
  );
