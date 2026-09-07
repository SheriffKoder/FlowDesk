/**
 * @file entities/customer/schema/customer-health.schema.ts
 *
 * Purpose: Zod contract for GET /api/customers/{id}/health body.
 * Used in: transforms, repository validation, unit tests.
 */

import { z } from "zod";

export const customerHealthEventSchema = z.object({
  id: z.string().min(1),
  at: z.string().datetime(),
  type: z.string().min(1),
  summary: z.string().min(1),
});

export const customerUsagePointSchema = z.object({
  period: z.string().min(1),
  value: z.number(),
});

export const customerHealthSchema = z.object({
  customerId: z.string().min(1),
  events: z.array(customerHealthEventSchema),
  usage: z.array(customerUsagePointSchema),
  notes: z.string(),
});

export type CustomerHealthRaw = z.input<typeof customerHealthSchema>;
export type CustomerHealthParsed = z.output<typeof customerHealthSchema>;
