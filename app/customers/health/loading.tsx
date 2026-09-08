/**
 * @file Route-level loading UI for Customer Health.
 * Mirrors list widget chrome; skeleton row height matches theme density (~40–44px).
 */

function SkeletonRow() {
  return (
    <div className="flex h-11 items-center gap-4 px-3" aria-hidden>
      <div className="h-3 w-40 animate-pulse rounded bg-muted" />
      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      <div className="ml-auto h-3 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}

function OverviewCardsSkeleton() {
  return (
    <div className="flex shrink-0 flex-col gap-4 md:flex-row" aria-hidden>
      <div className="widget-surface min-h-[7.5rem] min-w-0 flex-1 animate-pulse rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-row gap-4 md:contents">
        <div className="widget-surface min-h-[7.5rem] min-w-0 flex-1 animate-pulse rounded-xl" />
        <div className="widget-surface min-h-[7.5rem] min-w-0 flex-1 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col md:h-full md:min-h-0 md:overflow-hidden" aria-busy="true">
      <main className="mx-auto flex w-full flex-col px-6 pb-6 pt-8 md:min-h-0 md:flex-1 md:overflow-hidden">
        <div className="flex flex-col gap-4 md:min-h-0 md:flex-1 md:overflow-hidden">
          <OverviewCardsSkeleton />
          <div className="widget-surface flex h-[22rem] max-h-[55dvh] flex-col overflow-hidden rounded-xl md:h-auto md:max-h-none md:min-h-0 md:flex-1">
            <div className="mb-0 flex h-14 shrink-0 items-center gap-3 px-3">
              <div className="h-9 w-64 max-w-full animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="flex h-11 items-center gap-4 px-3">
              <div className="h-3 w-12 rounded bg-muted" />
              <div className="h-3 w-10 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-14 rounded bg-muted" />
              <div className="h-3 w-14 rounded bg-muted" />
              <div className="ml-auto h-3 w-14 rounded bg-muted" />
            </div>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
