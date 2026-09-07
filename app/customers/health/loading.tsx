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

export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background" aria-busy="true">
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col px-6 pb-6 pt-8">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-widget-border bg-widget">
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
      </main>
    </div>
  );
}
