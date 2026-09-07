/**
 * @file Server page header for Customer Health (view-local until shared `page-header`).
 */

export function PageHeader() {
  return (
    <header className="flex shrink-0 flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Customer Health
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        See which accounts are healthy and which need attention, then open a
        customer for events, usage, and notes.
      </p>
    </header>
  );
}
