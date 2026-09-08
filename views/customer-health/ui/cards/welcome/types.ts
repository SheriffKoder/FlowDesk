/**
 * @file views/customer-health/ui/cards/welcome/types.ts
 *
 * Purpose: Prop shapes for the welcome overview card.
 * Used in: `WelcomeCard`, overview row wiring.
 * Used for: Keep greeting + metric cells dumb (data from loaders).
 */

export type WelcomeMetric = {
  /** Short label under/above the value (e.g. “Customers”). */
  label: string;
  /** Pre-formatted display value (e.g. “24”, “$48.2k”, “72”). */
  value: string;
  /** Optional hint for screen readers when value is abbreviated. */
  valueLabel?: string;
};

export type WelcomeCardProps = {
  /** Display name in “Welcome back, {name}!” */
  name: string;
  /** Optional face URL — initials fallback when omitted. */
  avatarSrc?: string | null;
  /** Short supporting line under the greeting. */
  description: string;
  /** Three (or so) portfolio snapshot cells under the greeting. */
  metrics: readonly WelcomeMetric[];
  className?: string;
};
