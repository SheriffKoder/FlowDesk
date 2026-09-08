/**
 * @file widgets/app-sidebar/ui/app-shell.tsx
 *
 * Purpose: Root chrome — sidebar + header + main content region.
 * Used in: `app/layout.tsx`.
 * Used for: Own viewport height; place sidebar left (desktop) / bottom (mobile).
 *
 * Function Index:
 * - AppShell({ children }) → flex shell around page content
 */

import { MeshBackgroundHorizontal } from "@/shared/ui";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export type AppShellProps = {
  children: React.ReactNode;
};

/**
 * Full-viewport app frame.
 *
 * Layout:
 * - `md+`: rail left → (header + content); content is height-locked for nested scroll
 * - `<md`: (header + scrollable content) → bottom dock; page content scrolls
 * Mesh sits behind chrome; opaque header/sidebar keep it in the content canvas.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex h-svh flex-col overflow-hidden md:flex-row">
      <MeshBackgroundHorizontal />

      <AppSidebar variant="rail" className="relative z-10 hidden md:flex" />

      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        {/* Mobile: scroll the page; desktop: lock height for table/details nested scroll */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto md:overflow-hidden">
          {children}
        </div>
      </div>

      <AppSidebar variant="dock" className="relative z-10 flex md:hidden" />
    </div>
  );
}
