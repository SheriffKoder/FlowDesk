/**
 * @file features/customer-drawer/ui/customer-health-error.tsx
 *
 * Purpose: Drawer-local health error + optional retry (not route error.tsx).
 * Used in: CustomerDetailsPanel when fetch fails.
 */

import { Button } from "@/components/ui/button";
import type { CustomerHealthFetchErrorKind } from "@/entities/customer";

import { healthErrorCopy } from "../lib/health-error-copy";

export type CustomerHealthErrorProps = {
  kind: CustomerHealthFetchErrorKind | null;
  message: string | null;
  onRetry: () => void;
};

/**
 * Scoped failure UI — table stays usable while the panel shows retry.
 */
export function CustomerHealthError({
  kind,
  message,
  onRetry,
}: CustomerHealthErrorProps) {
  const copy = healthErrorCopy(kind, message);

  return (
    <div className="flex flex-col gap-3" role="alert">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{copy.title}</p>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>
      {copy.canRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
