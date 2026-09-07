"use client";

/**
 * @file shared/ui/details-panel/details-panel.tsx
 *
 * Purpose: Dumb in-layout details panel — children slot, focus trap, Escape, close.
 * Used in: Customer Health (and any list that opens a side details region).
 * Used for: Instant chrome beside the main content; not a modal overlay.
 *
 * Function Index:
 * - DetailsPanel(props) → dialog-ish side panel or null
 * - getFocusableElements(root) — Tab cycle candidates
 *
 * Steps:
 * 1. When closed → render null.
 * 2. On open → move focus into the panel; remember prior focus for restore.
 * 3. Trap Tab within focusables; Escape / close button → `onClose`.
 */

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { DetailsPanelProps } from "./types";

/////////////////////////////////////////////////////////////
// Focus helpers
/////////////////////////////////////////////////////////////

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Collect keyboard-focusable elements inside a root (visible only).
 */
function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.tabIndex !== -1,
  );
}

/////////////////////////////////////////////////////////////
// Component
/////////////////////////////////////////////////////////////

/**
 * In-layout details panel with focus trap and Escape-to-close.
 * Callers own width/placement via `className` (e.g. flex sibling of a table).
 */
export function DetailsPanel({
  open,
  title,
  onClose,
  children,
  className,
  "aria-describedby": ariaDescribedBy,
}: DetailsPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      return;
    }

    //////////////////////////////////
    // 2. Capture prior focus; move into panel (close button).
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    //////////////////////////////////

    function handleKeyDown(event: KeyboardEvent): void {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      //////////////////////////////////
      // Escape always closes (focus restores in cleanup).
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      //////////////////////////////////

      //////////////////////////////////
      // 3. Tab cycle within panel focusables.
      if (event.key !== "Tab") {
        return;
      }

      const focusables = getFocusableElements(panel);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last?.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first?.focus();
      }
      //////////////////////////////////
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={ariaDescribedBy}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-lg border border-widget-border bg-widget text-widget-foreground",
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-right-2 motion-safe:duration-150",
        "motion-reduce:animate-none",
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-widget-border px-4 py-3">
        <h2
          id={titleId}
          className="min-w-0 flex-1 text-base font-semibold leading-snug text-widget-foreground"
        >
          {title}
        </h2>
        <Button
          ref={closeButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Close details"
          onClick={() => {
            onClose();
          }}
        >
          <X aria-hidden />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-4">{children}</div>
    </aside>
  );
}
