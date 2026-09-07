/**
 * @file entities/customer/transform/to-customer-list-item.ts
 *
 * Purpose: Parse/validate raw list row into domain CustomerListItem.
 * Used in: repository when loading fixtures / future API upstream.
 */

import type { CustomerListItem } from "../model/customer";
import {
  customerListItemSchema,
  type CustomerListItemRaw,
} from "../schema/customer-list-item.schema";

/**
 * Validate and map a raw list row to the domain type.
 *
 * @param raw - Untrusted list row payload
 * @returns Domain CustomerListItem
 * @throws ZodError when the payload does not match the schema
 */
export function toCustomerListItem(raw: CustomerListItemRaw): CustomerListItem {
  return customerListItemSchema.parse(raw);
}

/**
 * Validate a list of raw rows.
 *
 * @param rawItems - Untrusted row array
 * @returns Domain CustomerListItem[]
 */
export function toCustomerListItems(
  rawItems: CustomerListItemRaw[],
): CustomerListItem[] {
  return rawItems.map((item) => toCustomerListItem(item));
}
