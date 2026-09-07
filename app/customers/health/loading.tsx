/**
 * @file Route-level loading UI for Customer Health.
 * Skeleton row height matches theme density (~40–44px).
 */

function SkeletonRow() {
  return (
    <div
      className="flex h-11 items-center gap-4 border-b border-border px-3"
      aria-hidden
    >
      <div className="h-3 w-40 animate-pulse rounded bg-muted" />
      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="ml-auto h-3 w-28 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8" aria-busy="true">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-4 h-10 w-full max-w-md animate-pulse rounded bg-muted" />
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex h-11 items-center gap-4 border-b border-border bg-muted/40 px-3">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-14 rounded bg-muted" />
          <div className="ml-auto h-3 w-14 rounded bg-muted" />
        </div>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    </main>
  );
}
