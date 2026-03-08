export { Navigation } from './navigation'
export type {
  NavigationRootProps,
  NavigationListProps,
  NavigationItemProps,
  NavigationTriggerProps,
  NavigationContentProps,
  NavigationLinkProps,
} from './types'

// Backward compatibility exports (NavigationMenu* aliases)
import { Navigation } from './navigation'
export const NavigationMenu = Navigation.Root
export const NavigationMenuList = Navigation.List
export const NavigationMenuItem = Navigation.Item
export const NavigationMenuTrigger = Navigation.Trigger
export const NavigationMenuContent = Navigation.Content
export const NavigationMenuLink = Navigation.Link
