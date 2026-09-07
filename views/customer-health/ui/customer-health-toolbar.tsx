"use client";

/**
 * @file views/customer-health/ui/customer-health-toolbar.tsx
 *
 * Purpose: Client filter bar — search (segment lands in Step 8).
 * Used in: `CustomerListShell`.
 * Used for: Debounced URL `search` with shared pending UX owned by the shell.
 *
 * Function Index:
 * - CustomerHealthToolbar({ search, onSearchChange }) → filter row
 *
 * Steps:
 * 1. Render shared SearchInput bound to URL-committed `search`.
 * 2. Commit → parent `patchParams({ search })` (page reset + scroll:false).
 */

import { SearchInput } from "@/shared/ui";

export type CustomerHealthToolbarProps = {
  /** Committed search from URL (`list.params.search`). */
  search: string;
  /** Debounced / Enter commit from SearchInput. */
  onSearchChange: (search: string) => void;
};

/**
 * List filter toolbar. Segment control stays a placeholder until Step 8.
 */
export function CustomerHealthToolbar({
  search,
  onSearchChange,
}: CustomerHealthToolbarProps) {
  return (
    <div
      className="flex shrink-0 flex-wrap items-end gap-3 rounded-md border border-border bg-muted/60 px-3 py-2"
      role="search"
      aria-label="Customer list filters"
    >
      <SearchInput
        label="Search"
        placeholder="Search by name or domain"
        value={search}
        onValueCommit={onSearchChange}
        className="min-w-[12rem] flex-1"
      />
      <div
        className="h-9 min-w-[8.5rem] rounded-md border border-border bg-card px-3 text-sm leading-9 text-muted-foreground"
        aria-hidden
      >
        Segment
      </div>
    </div>
  );
}
