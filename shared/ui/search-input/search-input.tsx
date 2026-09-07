"use client";

/**
 * @file shared/ui/search-input/search-input.tsx
 *
 * Purpose: Dumb search field — local draft owns typing; URL is a side effect.
 * Used in: Customer Health toolbar (and any URL-driven list search).
 * Used for: Type freely without soft-nav overwriting the input; push trimmed
 *   commits after debounce / Enter; adopt URL only on external history changes.
 *
 * Function Index:
 * - SearchInput(props) → labeled text input
 *
 * Steps:
 * 1. Keep local `draft` as the field value (never mirror every URL soft-nav).
 * 2. Debounce / Enter → `onValueCommit`; remember what we last pushed.
 * 3. Rehydrate from `value` only when it differs from our last commit
 *    (back/forward / shared-link), so in-flight typing is never snatched.
 */

import { useEffect, useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { SearchInputProps } from "./types";

const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Debounced search input: local draft while typing, URL via `onValueCommit`.
 */
export function SearchInput({
  label,
  placeholder = "Search…",
  debounceMs = DEFAULT_DEBOUNCE_MS,
  value,
  onValueCommit,
  disabled = false,
  className,
  id: idProp,
  hideLabel = false,
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  //////////////////////////////////
  // 1. Local draft — source of truth for the visible input.
  const [draft, setDraft] = useState(value);
  const onValueCommitRef = useRef(onValueCommit);
  onValueCommitRef.current = onValueCommit;
  /** Last string we pushed via commit (not every prop `value` echo). */
  const lastCommittedRef = useRef(value);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  //////////////////////////////////

  function commit(next: string): void {
    lastCommittedRef.current = next;
    onValueCommitRef.current(next);
  }

  function clearDebounceTimer(): void {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }

  //////////////////////////////////
  // 3. External URL only (back/forward) — ignore echoes of our own commits.
  useEffect(() => {
    if (value === lastCommittedRef.current) {
      return;
    }
    lastCommittedRef.current = value;
    setDraft(value);
  }, [value]);
  //////////////////////////////////

  //////////////////////////////////
  // 2. Debounce draft → URL commit (local state stays put while pending).
  useEffect(() => {
    const next = draft.trim();
    if (next === lastCommittedRef.current) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      commit(next);
    }, debounceMs);

    return () => {
      clearDebounceTimer();
    };
  }, [draft, debounceMs]);
  //////////////////////////////////

  function flushCommit(): void {
    clearDebounceTimer();

    const next = draft.trim();
    if (next === lastCommittedRef.current) {
      if (draft !== next) {
        setDraft(next);
      }
      return;
    }

    commit(next);
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label
        htmlFor={inputId}
        className={cn(
          "text-xs font-medium uppercase tracking-wide text-muted-foreground",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </Label>
      <Input
        id={inputId}
        type="search"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="h-9 max-w-xs bg-card"
        aria-label={hideLabel ? label : undefined}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            flushCommit();
          }
        }}
      />
    </div>
  );
}
