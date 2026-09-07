/**
 * @file entities/customer/model/segment.ts
 *
 * Purpose: Customer health segment enum + display options (entity source of truth).
 * Used in: schemas, list filters, shared FilterOptionButtons options.
 * Used for: Align API + domain + UI on healthy / watch / at_risk.
 */

export const CUSTOMER_SEGMENTS = ["healthy", "watch", "at_risk"] as const;

export type CustomerSegment = (typeof CUSTOMER_SEGMENTS)[number];

/** Human labels for segment filter buttons / table cells. */
export const CUSTOMER_SEGMENT_LABELS: Record<CustomerSegment, string> = {
  healthy: "Healthy",
  watch: "Watch",
  at_risk: "At risk",
};

/**
 * Static options for multi-select segment filter UI.
 * Order matches {@link CUSTOMER_SEGMENTS}.
 */
export const CUSTOMER_SEGMENT_OPTIONS = CUSTOMER_SEGMENTS.map((value) => ({
  value,
  label: CUSTOMER_SEGMENT_LABELS[value],
}));
