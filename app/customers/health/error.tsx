"use client";

/**
 * @file Route-level error UI for Customer Health.
 */

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <h1 className="text-lg font-medium text-foreground">
        Couldn't load customer health
      </h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong while loading this page. Your filters are still in
        the URL — try again, or return home and reopen the list.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3 text-sm text-foreground hover:bg-accent"
        >
          Back home
        </a>
      </div>
    </main>
  );
}
