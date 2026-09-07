/**
 * @file entities/customer/repository/get-customer-health.ts
 *
 * Purpose: Look up a validated health payload by customer id.
 * Used in: queries/get-customer-health.
 */

import { customerHealthFixtureById, customerListFixture } from "@/tests/fixtures";

import type { CustomerHealthDetail } from "../model/customer";
import { toCustomerHealth } from "../transform/to-customer-health";
import {
  CustomerNotFoundError,
  CustomerUpstreamError,
} from "../errors/customer-errors";

/**
 * Return health detail for a customer id, or throw not-found.
 *
 * @param customerId - Customer id from the route
 * @returns Domain CustomerHealthDetail
 * @throws CustomerNotFoundError when id is unknown
 * @throws CustomerUpstreamError when fixture data fails validation
 */
export function findCustomerHealthById(
  customerId: string,
): CustomerHealthDetail {
  const existsInList = customerListFixture.some(
    (customer) => customer.id === customerId,
  );
  if (!existsInList) {
    throw new CustomerNotFoundError(customerId);
  }

  const raw = customerHealthFixtureById[customerId];
  if (!raw) {
    throw new CustomerNotFoundError(customerId);
  }

  try {
    return toCustomerHealth(raw);
  } catch (error) {
    throw new CustomerUpstreamError(
      error instanceof Error ? error.message : "Invalid health fixture",
    );
  }
}
