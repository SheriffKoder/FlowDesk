/**
 * @file features/customer-drawer/ui/customer-health-body.tsx
 *
 * Purpose: Sectioned health detail body (events, usage, notes).
 * Used in: CustomerDetailsPanel when fetch succeeds.
 * Used for: Calm, hairline-divided sections matching overview UX.
 */

import type { CustomerHealthDetail } from "@/entities/customer";

export type CustomerHealthBodyProps = {
  detail: CustomerHealthDetail;
};

function formatEventAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Presentational health sections — no fetch knowledge.
 */
export function CustomerHealthBody({ detail }: CustomerHealthBodyProps) {
  return (
    <div className="flex flex-col gap-0 text-sm">
      <section className="pb-4" aria-labelledby="customer-health-events">
        <h3
          id="customer-health-events"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Recent events
        </h3>
        {detail.events.length === 0 ? (
          <p className="text-muted-foreground">No recent events.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {detail.events.map((event) => (
              <li key={event.id} className="min-w-0">
                <p className="font-medium text-foreground">{event.summary}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <span className="capitalize">{event.type}</span>
                  {" · "}
                  <time dateTime={event.at}>{formatEventAt(event.at)}</time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-border" role="separator" />

      <section className="py-4" aria-labelledby="customer-health-usage">
        <h3
          id="customer-health-usage"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Usage trends
        </h3>
        {detail.usage.length === 0 ? (
          <p className="text-muted-foreground">No usage points.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {detail.usage.map((point) => (
              <li
                key={point.period}
                className="flex items-baseline justify-between gap-3"
              >
                <span className="text-muted-foreground">{point.period}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {point.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-border" role="separator" />

      <section className="pt-4" aria-labelledby="customer-health-notes">
        <h3
          id="customer-health-notes"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Notes
        </h3>
        <p className="whitespace-pre-wrap text-foreground">
          {detail.notes.trim().length > 0 ? detail.notes : "No notes yet."}
        </p>
      </section>
    </div>
  );
}
