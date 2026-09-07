/**
 * @file entities/customer/model/segment.ts
 *
 * Purpose: Customer health segment enum (entity source of truth).
 * Used in: schemas, list filters, static filter options later.
 * Used for: Align API + domain on healthy / watch / at_risk.
 */

export const CUSTOMER_SEGMENTS = ["healthy", "watch", "at_risk"] as const;

export type CustomerSegment = (typeof CUSTOMER_SEGMENTS)[number];
