/**
 * @file widgets/app-sidebar/ui/app-shell.tsx
 *
 * Purpose: Root chrome — sidebar + main content region.
 * Used in: `app/layout.tsx`.
 * Used for: Own viewport height; place sidebar left (desktop) / bottom (mobile).
 *
 * Function Index:
 * - AppShell({ children }) → flex shell around page content
 */

import { AppSidebar } from "./app-sidebar";

export type AppShellProps = {
  children: React.ReactNode;
};

/**
 * Full-viewport app frame. Children fill the remaining space (`min-h-0` for nested scroll).
 *
 * Layout:
 * - `md+`: rail left → content
 * - `<md`: content → bottom dock (no logo)
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background md:flex-row">
      <AppSidebar variant="rail" className="hidden md:flex" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>

      <AppSidebar variant="dock" className="flex md:hidden" />
    </div>
  );
}
