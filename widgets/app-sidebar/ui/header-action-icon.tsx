/**
 * @file widgets/app-sidebar/ui/header-action-icon.tsx
 *
 * Purpose: Compact icon control for the header actions slot.
 * Used in: Default header actions (bell, messages — often disabled stubs).
 * Used for: Consistent hit target + muted disabled look.
 */

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type HeaderActionIconProps = {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * Ghost icon button sized for the layout header toolbar.
 */
export function HeaderActionIcon({
  icon: Icon,
  label,
  disabled = false,
  onClick,
  className,
}: HeaderActionIconProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
