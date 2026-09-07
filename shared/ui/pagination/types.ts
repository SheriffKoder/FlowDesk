/**
 * @file Props for the shared list pagination footer.
 */

export type PaginationProps = {
  /** 1-based current page (already clamped by the list loader when possible). */
  page: number;
  pageSize: number;
  /** Total matching rows after filters (pre-pagination). */
  total: number;
  /** Allowed page sizes (e.g. 10 / 20 / 50). */
  pageSizeOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  /** Dim + disable controls while a list navigation is pending. */
  isPending?: boolean;
  className?: string;
  "aria-label"?: string;
};
