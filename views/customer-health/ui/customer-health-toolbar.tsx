"use client";

/**
 * @file Client toolbar island placeholder (URL + useTransition land later).
 */

export function CustomerHealthToolbar() {
  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-3 rounded-md border border-border bg-muted/60 px-3 py-2"
      role="search"
      aria-label="Customer list filters"
    >
      <div
        className="h-9 w-full max-w-xs rounded-md border border-border bg-card px-3 text-sm leading-9 text-muted-foreground"
        aria-hidden
      >
        Search customers…
      </div>
      <div
        className="h-9 min-w-[8.5rem] rounded-md border border-border bg-card px-3 text-sm leading-9 text-muted-foreground"
        aria-hidden
      >
        Segment
      </div>
      <p className="text-xs text-muted-foreground">
        Toolbar controls land in later tickets
      </p>
    </div>
  );
}
