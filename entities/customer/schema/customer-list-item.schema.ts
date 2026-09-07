/**
 * @file entities/customer/schema/customer-list-item.schema.ts
 *
 * Purpose: Zod contract for one customer list row (API/raw → domain).
 * Used in: list response schema, transforms, unit tests.
 */

import { z } from "zod";

import { CUSTOMER_SEGMENTS } from "../model/segment";

export const customerListItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  domain: z.string().min(1),
  mrr: z.number().nonnegative(),
  lastActive: z.string().datetime(),
  health: z.number().min(0).max(100),
  owner: z.string().min(1),
  segment: z.enum(CUSTOMER_SEGMENTS),
});

export type CustomerListItemRaw = z.input<typeof customerListItemSchema>;
export type CustomerListItemParsed = z.output<typeof customerListItemSchema>;
