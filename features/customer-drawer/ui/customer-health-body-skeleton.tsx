/**
 * @file features/customer-drawer/ui/customer-health-body-skeleton.tsx
 *
 * Purpose: Loading placeholder matching health body section layout.
 * Used in: CustomerDetailsPanel while health fetch is in flight.
 * Used for: Avoid layout jump — same groups as CustomerHealthBody.
 */

import { cn } from "@/lib/utils";

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-muted", className)}
      aria-hidden
    />
  );
}

/**
 * Section-shaped skeleton: real headings + shimmer blocks per group.
 */
export function CustomerHealthBodySkeleton() {
  return (
    <div
      className="flex flex-col gap-0 text-sm"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading health details"
    >
      <section className="pb-4" aria-labelledby="customer-health-events-skel">
        <h3
          id="customer-health-events-skel"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Recent events
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <ShimmerBlock className="h-4 w-3/4" />
            <ShimmerBlock className="h-3 w-1/2" />
          </div>
          <div className="flex flex-col gap-1.5">
            <ShimmerBlock className="h-4 w-2/3" />
            <ShimmerBlock className="h-3 w-2/5" />
          </div>
        </div>
      </section>

      <div className="border-t border-widget-border" role="separator" />

      <section className="py-4" aria-labelledby="customer-health-usage-skel">
        <h3
          id="customer-health-usage-skel"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Usage trends
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <ShimmerBlock className="h-3.5 w-20" />
            <ShimmerBlock className="h-3.5 w-10" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <ShimmerBlock className="h-3.5 w-20" />
            <ShimmerBlock className="h-3.5 w-10" />
          </div>
        </div>
      </section>

      <div className="border-t border-widget-border" role="separator" />

      <section className="pt-4" aria-labelledby="customer-health-notes-skel">
        <h3
          id="customer-health-notes-skel"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Notes
        </h3>
        <div className="flex flex-col gap-2">
          <ShimmerBlock className="h-3.5 w-full" />
          <ShimmerBlock className="h-3.5 w-5/6" />
        </div>
      </section>
    </div>
  );
}
