"use client";

/**
 * @file Page-size control — “Rows” trigger + DropdownMenu radio list.
 */

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PaginationPageSizeSelectProps = {
  pageSize: number;
  pageSizeOptions: readonly number[];
  disabled?: boolean;
  onPageSizeChange: (pageSize: number) => void;
};

export function PaginationPageSizeSelect({
  pageSize,
  pageSizeOptions,
  disabled = false,
  onPageSizeChange,
}: PaginationPageSizeSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden text-xs uppercase tracking-wide md:inline"
        id="pagination-rows-label"
      >
        Rows
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="button-secondary h-9 min-w-[3.25rem] justify-between gap-1 border-widget-border bg-widget px-2.5 font-normal tabular-nums shadow-none md:min-w-[4.5rem]"
            aria-labelledby="pagination-rows-label"
            aria-label={`Rows per page, ${pageSize}`}
          >
            {pageSize}
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[4.5rem]">
          <DropdownMenuRadioGroup
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            {pageSizeOptions.map((size) => (
              <DropdownMenuRadioItem
                key={size}
                value={String(size)}
                className="tabular-nums"
              >
                {size}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
