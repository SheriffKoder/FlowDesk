/**
 * @file views/customer-health/ui/cards/welcome/welcome-card.tsx
 *
 * Purpose: Greeting overview card — avatar + copy + portfolio metrics.
 * Used in: `OverviewCardsRow`.
 * Used for: Personal welcome above the customer list.
 *
 * Layout: flex-col → (flex-row avatar | greeting) → metrics row.
 */

import { cn } from "@/lib/utils";
import { Avatar } from "@/shared/ui";

import { CardShell } from "../card-shell";
import type { WelcomeCardProps } from "./types";
import { WelcomeMetrics } from "./welcome-metrics";

/**
 * Welcome back card with identity avatar, description, and metric cells.
 */
export function WelcomeCard({
  name,
  avatarSrc,
  description,
  metrics,
  className,
}: WelcomeCardProps) {
  const displayName = name.trim() || "there";

  return (
    <CardShell
      aria-label={`Welcome back, ${displayName}`}
      className={cn("justify-between gap-3", className)}
    >
      <div className="flex flex-row items-center gap-4">
        <Avatar
          name={displayName}
          src={avatarSrc}
          sizeClassName="size-16 text-sm"
          className="ring-2 ring-primary/30 ring-offset-2 ring-offset-widget"
        />

        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-base font-normal leading-snug text-foreground sm:text-lg">
            Welcome back,{" "}
            <span className="font-semibold">{displayName}!</span>
          </h2>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <WelcomeMetrics metrics={metrics} />
    </CardShell>
  );
}
