import { lazy, type ComponentType } from 'react'

export interface ComponentRoute {
  name: string
  path: string
  component: ComponentType
}

// Lazy load all component pages for code splitting
export const componentRoutes: ComponentRoute[] = [
  { name: 'Accordion', path: 'accordion', component: lazy(() => import('../pages/AccordionPage')) },
  { name: 'Alert', path: 'alert', component: lazy(() => import('../pages/AlertPage')) },
  { name: 'Avatar', path: 'avatar', component: lazy(() => import('../pages/AvatarPage')) },
  { name: 'Badge', path: 'badge', component: lazy(() => import('../pages/BadgePage')) },
  { name: 'Breadcrumb', path: 'breadcrumb', component: lazy(() => import('../pages/BreadcrumbPage')) },
  { name: 'Button', path: 'button', component: lazy(() => import('../pages/ButtonPage')) },
  { name: 'Card', path: 'card', component: lazy(() => import('../pages/CardPage')) },
  { name: 'Carousel', path: 'carousel', component: lazy(() => import('../pages/CarouselPage')) },
  { name: 'Checkbox', path: 'checkbox', component: lazy(() => import('../pages/CheckboxPage')) },
  { name: 'Collapsible', path: 'collapsible', component: lazy(() => import('../pages/CollapsiblePage')) },
  { name: 'ContextMenu', path: 'context-menu', component: lazy(() => import('../pages/ContextMenuPage')) },
  { name: 'Dialog', path: 'dialog', component: lazy(() => import('../pages/DialogPage')) },
  { name: 'Drawer', path: 'drawer', component: lazy(() => import('../pages/DrawerPage')) },
  { name: 'DropdownMenu', path: 'dropdown-menu', component: lazy(() => import('../pages/DropdownMenuPage')) },
  { name: 'Font Showcase', path: 'font-showcase', component: lazy(() => import('../pages/FontShowcasePage')) },
  { name: 'HoverCard', path: 'hover-card', component: lazy(() => import('../pages/HoverCardPage')) },
  { name: 'Input', path: 'input', component: lazy(() => import('../pages/InputPage')) },
  { name: 'NavigationMenu', path: 'navigation-menu', component: lazy(() => import('../pages/NavigationMenuPage')) },
  { name: 'NumberInput', path: 'number-input', component: lazy(() => import('../pages/NumberInputPage')) },
  { name: 'Pagination', path: 'pagination', component: lazy(() => import('../pages/PaginationPage')) },
  { name: 'Paper', path: 'paper', component: lazy(() => import('../pages/PaperPage')) },
  { name: 'Popover', path: 'popover', component: lazy(() => import('../pages/PopoverPage')) },
  { name: 'Progress', path: 'progress', component: lazy(() => import('../pages/ProgressPage')) },
  { name: 'Radio', path: 'radio', component: lazy(() => import('../pages/RadioPage')) },
  { name: 'ScrollArea', path: 'scroll-area', component: lazy(() => import('../pages/ScrollAreaPage')) },
  { name: 'Select', path: 'select', component: lazy(() => import('../pages/SelectPage')) },
  { name: 'Separator', path: 'separator', component: lazy(() => import('../pages/SeparatorPage')) },
  { name: 'Skeleton', path: 'skeleton', component: lazy(() => import('../pages/SkeletonPage')) },
  { name: 'Slider', path: 'slider', component: lazy(() => import('../pages/SliderPage')) },
  { name: 'Spinner', path: 'spinner', component: lazy(() => import('../pages/SpinnerPage')) },
  { name: 'Switch', path: 'switch', component: lazy(() => import('../pages/SwitchPage')) },
  { name: 'Table', path: 'table', component: lazy(() => import('../pages/TablePage')) },
  { name: 'Tabs', path: 'tabs', component: lazy(() => import('../pages/TabsPage')) },
  { name: 'Text', path: 'text', component: lazy(() => import('../pages/TextPage')) },
  { name: 'Textarea', path: 'textarea', component: lazy(() => import('../pages/TextareaPage')) },
  { name: 'Toast', path: 'toast', component: lazy(() => import('../pages/ToastPage')) },
  { name: 'Toolbar', path: 'toolbar', component: lazy(() => import('../pages/ToolbarPage')) },
  { name: 'Tooltip', path: 'tooltip', component: lazy(() => import('../pages/TooltipPage')) },
].sort((a, b) => a.name.localeCompare(b.name))

// Helper to get route by path
export const getRouteByPath = (path: string): ComponentRoute | undefined =>
  componentRoutes.find((route) => route.path === path)

// Helper to get adjacent routes for navigation
export const getAdjacentRoutes = (currentPath: string) => {
  const currentIndex = componentRoutes.findIndex((r) => r.path === currentPath)
  return {
    previous: currentIndex > 0 ? componentRoutes[currentIndex - 1] : null,
    next: currentIndex < componentRoutes.length - 1 ? componentRoutes[currentIndex + 1] : null,
    currentIndex,
    total: componentRoutes.length,
  }
}
