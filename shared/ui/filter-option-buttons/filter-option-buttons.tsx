"use client";

/**
 * @file shared/ui/filter-option-buttons/filter-option-buttons.tsx
 *
 * Purpose: Dumb option button row — config-driven labels, multi or single select.
 * Used in: Customer Health toolbar segment filter (and similar quick filters).
 * Used for: Toggle chips without dropdowns; no router/URL knowledge.
 *
 * Function Index:
 * - FilterOptionButtons(props) → labeled button group
 *
 * Steps:
 * 1. Derive selected set from `value`.
 * 2. On click — toggle (multi) or set/clear (single); emit ordered next list.
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { FilterOptionButtonsProps } from "./types";

/**
 * Horizontal toggle buttons driven by option config + controlled selection.
 */
export function FilterOptionButtons({
  label,
  options,
  value,
  onChange,
  selectionMode = "multi",
  className,
  hideLabel = false,
}: FilterOptionButtonsProps) {
  const selected = new Set(value);

  function emitNext(nextSelected: Set<string>): void {
    //////////////////////////////////
    // Keep option order stable for shareable URL serialization.
    const next = options
      .map((option) => option.value)
      .filter((optionValue) => nextSelected.has(optionValue));
    onChange(next);
    //////////////////////////////////
  }

  function handleToggle(optionValue: string): void {
    const next = new Set(selected);

    if (selectionMode === "single") {
      if (next.has(optionValue)) {
        next.clear();
      } else {
        next.clear();
        next.add(optionValue);
      }
      emitNext(next);
      return;
    }

    if (next.has(optionValue)) {
      next.delete(optionValue);
    } else {
      next.add(optionValue);
    }
    emitNext(next);
  }

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
      aria-label={label}
    >
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-wide text-muted-foreground",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </span>
      {options.map((option) => {
        const isSelected = selected.has(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "outline"}
            disabled={option.disabled}
            aria-pressed={isSelected}
            className="h-9 font-normal"
            onClick={() => {
              handleToggle(option.value);
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
