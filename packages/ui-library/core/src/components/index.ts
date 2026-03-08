'use client'

// =============================================================================
// Compound Components (namespace + individual exports for backward compatibility)
// =============================================================================
export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from './accordion'
export { Alert, AlertTitle, AlertDescription } from './alert'
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './breadcrumb'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
export { Dialog, DialogTrigger, DialogPortal, DialogBackdrop, DialogPopup, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './dialog'
export { Drawer } from './drawer'
export { Menu, ContextMenu, ContextMenuItem, ContextMenuSeparator, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './menu'
export { Navigation, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from './navigation'
export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from './pagination'
export { Paper, PaperHeader, PaperTitle, PaperDescription, PaperContent, PaperFooter } from './paper'
export { Popover } from './popover'
export { Radio, RadioGroup, RadioGroupItem } from './radio'
export { Select, SelectCompound } from './select'
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from './table'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Toast, useToast, ToastProvider } from './toast'
export { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup, ToolbarLink } from './toolbar'
export { Tooltip } from './tooltip'

// =============================================================================
// Form Components (direct exports)
// =============================================================================
export { Button } from './form/button'
export { Input } from './form/input'
export { Textarea } from './form/textarea'
export { NumberInput } from './form/number-input'
export { Checkbox } from './form/checkbox'
export { Switch } from './form/switch'
export { Slider } from './form/slider'
export { ButtonStyles } from './form/styles'

// =============================================================================
// Display Components (direct exports)
// =============================================================================
export { Avatar } from './display/avatar'
export { Badge } from './display/badge'
export { Spinner } from './display/spinner'
export { Skeleton } from './display/skeleton'
export { Separator } from './display/separator'
export { Progress } from './display/progress'
export { ScrollArea } from './display/scroll-area'
export { Carousel } from './display/carousel'

// =============================================================================
// Typography Components
// =============================================================================
export { Text, TextStyles } from './text'

// =============================================================================
// Theme Components (direct exports)
// =============================================================================
export { ThemeSwitcher, ThemeSwitcherStyles } from './theme-switcher'
