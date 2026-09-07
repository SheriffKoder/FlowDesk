/**
 * @file Route-level not-found UI for Customer Health.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <h1 className="text-lg font-medium text-foreground">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        This customer health view doesn't exist, or the link is out of date.
        Head back to the overview to continue triage.
      </p>
      <Link
        href="/customers/health"
        className="inline-flex h-9 w-fit items-center rounded-md bg-primary px-3 text-sm text-primary-foreground hover:opacity-90"
      >
        Open customer health
      </Link>
    </main>
  );
}
