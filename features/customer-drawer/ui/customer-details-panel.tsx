"use client";

/**
 * @file features/customer-drawer/ui/customer-details-panel.tsx
 *
 * Purpose: Customer details chrome + health body (loading / error / sections).
 * Used in: Customer Health list shell (beside the table).
 * Used for: Title + close; fetch health by open customer id (Step 11).
 *
 * Function Index:
 * - CustomerDetailsPanel(props) → in-layout DetailsPanel + health states
 *
 * Steps:
 * 1. Drive `useCustomerHealth` from open + customerId (no fetch when closed).
 * 2. Render loading, error+retry, or sectioned body — never throw to route.
 */

import { DetailsPanel } from "@/shared/ui";

import { useCustomerHealth } from "../hooks/use-customer-health";
import { CustomerHealthBody } from "./customer-health-body";
import { CustomerHealthBodySkeleton } from "./customer-health-body-skeleton";
import { CustomerHealthError } from "./customer-health-error";

export type CustomerDetailsPanelProps = {
  open: boolean;
  /** Selected customer id while open (null when closed). */
  customerId: string | null;
  /** Display title (usually customer name; falls back in the shell). */
  title: string;
  onClose: () => void;
  className?: string;
};

/**
 * Feature-level details panel: shared shell + health fetch states.
 */
export function CustomerDetailsPanel({
  open,
  customerId,
  title,
  onClose,
  className,
}: CustomerDetailsPanelProps) {
  //////////////////////////////////
  // 1. Fetch only while the panel is open with an id.
  const health = useCustomerHealth({
    customerId,
    enabled: open && customerId != null,
  });
  //////////////////////////////////

  return (
    <DetailsPanel
      open={open}
      title={title}
      onClose={onClose}
      className={className}
    >
      {health.status === "loading" || health.status === "idle" ? (
        <CustomerHealthBodySkeleton />
      ) : null}

      {health.status === "error" ? (
        <CustomerHealthError
          kind={health.errorKind}
          message={health.errorMessage}
          onRetry={health.retry}
        />
      ) : null}

      {health.status === "success" && health.data ? (
        <CustomerHealthBody detail={health.data} />
      ) : null}
    </DetailsPanel>
  );
}
