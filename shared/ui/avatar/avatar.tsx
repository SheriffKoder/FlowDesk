"use client";

/**
 * @file shared/ui/avatar/avatar.tsx
 *
 * Purpose: Dumb circular avatar — image when available, initials fallback.
 * Used in: Table owner cells (and any identity chrome).
 * Used for: Show a face or muted initials circle without domain knowledge.
 *
 * Steps:
 * 1. If `src` is set, try `<img>`; on error, fall back to initials.
 * 2. Otherwise render muted rounded circle with {@link getInitials}(name).
 */

import { useState } from "react";

import { cn } from "@/lib/utils";

import { getInitials } from "./lib/initials";
import type { AvatarProps } from "./types";

export function Avatar({
  name,
  src,
  className,
  sizeClassName = "size-7",
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(src) && !imageFailed;
  const initials = getInitials(name);
  const label = name.trim() || "Unknown";

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner URLs; not in next/image remotePatterns
      <img
        src={src!}
        alt=""
        title={label}
        className={cn(
          "shrink-0 rounded-full object-cover",
          sizeClassName,
          className,
        )}
        onError={() => {
          setImageFailed(true);
        }}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground",
        sizeClassName,
        className,
      )}
      title={label}
      aria-hidden
    >
      {initials}
    </span>
  );
}
