"use client";

/**
 * @file views/customer-health/ui/cards/placeholder/placeholder-card.tsx
 *
 * Purpose: Square overview card with ThinkingOrb sized to the box pixels.
 * Used in: `OverviewCardsRow`.
 * Used for: Ambient orb slot; equal-width with segment card on mobile,
 *           height-matched square (`width = height`) from `md` up.
 *
 * Steps:
 * 1. Shell fills cell (`h-full w-full`); `md+` uses `aspect-square`.
 * 2. ResizeObserver reads content-box px → `size` for ThinkingOrb.
 * 3. Render orb only once measured (avoids 0×0 / intrinsic blow-up).
 */

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ThinkingOrb } from "@/shared/ui";

import type { PlaceholderCardProps } from "./types";

/**
 * Height-matched square; ThinkingOrb `size` = measured box (min side, CSS px).
 */
export function PlaceholderCard({
  className,
  "aria-label": ariaLabel = "Overview placeholder",
}: PlaceholderCardProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) {
      return;
    }

    const syncSize = (width: number, height: number) => {
      const next = Math.max(0, Math.floor(Math.min(width, height)));
      setSize((prev) => (prev === next ? prev : next));
    };

    syncSize(el.clientWidth, el.clientHeight);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      syncSize(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={boxRef}
      aria-label={ariaLabel}
      role="region"
      className={cn(
        "flex h-full min-w-0 w-full items-center justify-center overflow-hidden",
        "rounded-lg text-widget-foreground",
        "md:aspect-square md:w-auto md:shrink-0",
        className,
      )}
    >
      {size > 0 ? (
        <div>
          <div className="hidden dark:block">
        <ThinkingOrb
          state="working"
          size={size}
          speed={0.1}
          className="h-full w-full"
        />
          </div>
          <div className="block dark:hidden">
        <ThinkingOrb
          state="composing"
          size={size}
          speed={0.1}
          className="h-full w-full text-primary"
        />
          </div>
        </div>
      ) : null}
    </div>
  );
}
