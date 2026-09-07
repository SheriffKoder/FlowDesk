"use client";

/**
 * @file views/customer-health/ui/customer-health-toolbar.tsx
 *
 * Purpose: Client filter bar — search + multi-select segment buttons.
 * Used in: `CustomerListShell` (inside the list widget surface).
 * Used for: Debounced URL `search` and segment chip toggles with shared pending UX.
 *
 * Function Index:
 * - CustomerHealthToolbar(props) → filter row
 *
 * Steps:
 * 1. SearchInput → URL `search` (page reset via patch).
 * 2. FilterOptionButtons → URL `segment` multi-select (OR filter).
 */

import { FilterOptionButtons, SearchInput } from "@/shared/ui";

import { customerHealthListConfig } from "../model/list-config";
import type { CustomerSegment } from "../model/list-url-params";

export type CustomerHealthToolbarProps = {
  /** Committed search from URL (`list.params.search`). */
  search: string;
  /** Debounced / Enter commit from SearchInput. */
  onSearchChange: (search: string) => void;
  /** Selected segments from URL (empty = all). */
  segment: readonly CustomerSegment[];
  /** Multi-select commit from FilterOptionButtons. */
  onSegmentChange: (segment: CustomerSegment[]) => void;
};

const segmentFilter = customerHealthListConfig.filters[0];

/**
 * List filter toolbar: search + Healthy / Watch / At risk chips.
 * No own surface — parent widget provides background + border.
 */
export function CustomerHealthToolbar({
  search,
  onSearchChange,
  segment,
  onSegmentChange,
}: CustomerHealthToolbarProps) {
  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-3 px-3 py-3"
      role="search"
      aria-label="Customer list filters"
    >
      <SearchInput
        label="Search"
        hideLabel
        placeholder={customerHealthListConfig.search.placeholder}
        value={search}
        onValueCommit={onSearchChange}
        className="min-w-[12rem] flex-1"
      />
      <FilterOptionButtons
        label={segmentFilter.label}
        hideLabel
        options={segmentFilter.options}
        value={segment}
        selectionMode="multi"
        onChange={(next) => {
          onSegmentChange(next as CustomerSegment[]);
        }}
      />
    </div>
  );
}
