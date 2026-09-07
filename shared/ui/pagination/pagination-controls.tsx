"use client";

/**
 * @file Right-side control cluster: page size + prev/next nav.
 */

import { PaginationNav } from "./pagination-nav";
import { PaginationPageSizeSelect } from "./pagination-page-size-select";

export type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalPages: number;
  pageSizeOptions: readonly number[];
  canPrev: boolean;
  canNext: boolean;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function PaginationControls({
  page,
  pageSize,
  totalPages,
  pageSizeOptions,
  canPrev,
  canNext,
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PaginationPageSizeSelect
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        disabled={disabled}
        onPageSizeChange={onPageSizeChange}
      />
      <PaginationNav
        page={page}
        totalPages={totalPages}
        canPrev={canPrev}
        canNext={canNext}
        onPageChange={onPageChange}
      />
    </div>
  );
}
