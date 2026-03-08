export const BottomNavStyles = {
  nav: [
    'fixed bottom-0 left-0 right-0 z-50',
    'flex items-center justify-around',
    'h-14 w-full',
    'border-t border-border',
    'bg-background/95 backdrop-blur-sm',
    'safe-bottom',
  ].join(' '),
  link: [
    'flex flex-col items-center justify-center',
    'w-full h-full',
    'text-muted-foreground',
    'transition-colors duration-150',
  ].join(' '),
  linkActive: [
    'flex flex-col items-center justify-center',
    'w-full h-full',
    'text-foreground',
    'transition-colors duration-150',
  ].join(' '),
  icon: 'h-5 w-5',
  label: 'text-xs mt-0.5',
} as const
