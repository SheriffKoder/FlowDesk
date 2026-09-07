/**
 * @file Public exports for the app-sidebar widget.
 *
 * App chrome: slim icon rail + mobile bottom dock + layout header.
 */

export {
  appNavItems,
  type AppNavItem,
} from "./model/nav-config";

export {
  appPages,
  type AppPageConfig,
} from "./model/page-config";

export { getCurrentPage } from "./lib/get-current-page";

export {
  AppSidebar,
  type AppSidebarProps,
  type AppSidebarVariant,
} from "./ui/app-sidebar";

export { AppHeader, type AppHeaderProps } from "./ui/app-header";

export {
  HeaderActions,
  type HeaderActionsProps,
} from "./ui/header-actions";

export {
  HeaderActionIcon,
  type HeaderActionIconProps,
} from "./ui/header-action-icon";

export { UserArea, type UserAreaProps } from "./ui/user-area";

export { formatHeaderDate } from "./lib/format-header-date";

export { AppShell, type AppShellProps } from "./ui/app-shell";
