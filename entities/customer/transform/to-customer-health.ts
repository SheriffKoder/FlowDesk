/**
 * @file entities/customer/transform/to-customer-health.ts
 *
 * Purpose: Parse/validate raw health payload into domain CustomerHealthDetail.
 * Used in: repository when loading fixtures / future upstream.
 */

import type { CustomerHealthDetail } from "../model/customer";
import {
  customerHealthSchema,
  type CustomerHealthRaw,
} from "../schema/customer-health.schema";

/**
 * Validate and map a raw health payload to the domain type.
 *
 * @param raw - Untrusted health payload
 * @returns Domain CustomerHealthDetail
 * @throws ZodError when the payload does not match the schema
 */
export function toCustomerHealth(raw: CustomerHealthRaw): CustomerHealthDetail {
  return customerHealthSchema.parse(raw);
}
