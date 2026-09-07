/**
 * @file Public exports for the app-sidebar widget.
 *
 * App chrome: slim icon rail + mobile bottom dock, driven by nav config.
 */

export {
  appNavItems,
  type AppNavItem,
} from "./model/nav-config";

export {
  AppSidebar,
  type AppSidebarProps,
  type AppSidebarVariant,
} from "./ui/app-sidebar";

export { AppShell, type AppShellProps } from "./ui/app-shell";
