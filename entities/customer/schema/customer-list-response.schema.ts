/**
 * @file entities/customer/schema/customer-list-response.schema.ts
 *
 * Purpose: Zod contract for paginated GET /api/customers JSON body.
 * Used in: API validation helpers, unit/integration tests.
 */

import { z } from "zod";

import { customerListItemSchema } from "./customer-list-item.schema";

export const customerListResponseSchema = z.object({
  data: z.array(customerListItemSchema),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export type CustomerListResponseRaw = z.input<typeof customerListResponseSchema>;
export type CustomerListResponseParsed = z.output<
  typeof customerListResponseSchema
>;
