/**
 * @file entities/customer/queries/get-customer-health.ts
 *
 * Purpose: Get-customer-health use-case.
 * Used in: GET /api/customers/[id]/health route adapter.
 */

import type { CustomerHealthDetail } from "../model/customer";
import { findCustomerHealthById } from "../repository/get-customer-health";

/**
 * Load health detail for a customer id.
 *
 * @param customerId - Route param id
 * @returns Domain health payload
 * @throws CustomerNotFoundError | CustomerUpstreamError
 */
export function getCustomerHealth(customerId: string): CustomerHealthDetail {
  return findCustomerHealthById(customerId);
}
