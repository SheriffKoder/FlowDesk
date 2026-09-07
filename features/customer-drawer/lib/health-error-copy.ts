/**
 * @file features/customer-drawer/lib/health-error-copy.ts
 *
 * Purpose: User-facing titles/messages for drawer-local health failures.
 * Used in: CustomerHealthError.
 * Used for: Distinguish offline vs not-found vs network/server (plan Step 11).
 */

import type { CustomerHealthFetchErrorKind } from "@/entities/customer";

export type HealthErrorCopy = {
  title: string;
  description: string;
  /** Whether a Retry button is useful for this kind. */
  canRetry: boolean;
};

/**
 * Map a fetch error kind to panel copy.
 */
export function healthErrorCopy(
  kind: CustomerHealthFetchErrorKind | null,
  fallbackMessage: string | null,
): HealthErrorCopy {
  switch (kind) {
    case "offline":
      return {
        title: "You're offline",
        description:
          fallbackMessage ??
          "Check your connection, then try loading health details again.",
        canRetry: true,
      };
    case "not_found":
      return {
        title: "Customer not found",
        description:
          fallbackMessage ??
          "This account may have been removed, or the link is out of date.",
        canRetry: false,
      };
    case "network":
      return {
        title: "Couldn't reach the server",
        description:
          fallbackMessage ?? "Check your connection and try again.",
        canRetry: true,
      };
    case "invalid_response":
      return {
        title: "Unexpected response",
        description:
          fallbackMessage ??
          "Health details came back in an unexpected format. Try again.",
        canRetry: true,
      };
    case "server":
    case "aborted":
    case null:
    default:
      return {
        title: "Couldn't load health details",
        description:
          fallbackMessage ?? "Something went wrong on the server. Try again.",
        canRetry: kind !== "aborted",
      };
  }
}
