export const TooltipStyles = {
  trigger: 'inline-block cursor-pointer [&_svg]:transition-colors hover:[&_svg]:stroke-primary',
  positioner: 'z-50',
  popup: 'relative z-10 px-3 py-1.5 text-sm text-foreground whitespace-nowrap bg-neu-base rounded-theme-md shadow-neu-raised',
  arrow: {
    base: 'absolute z-0 w-2 h-2 bg-neu-base',
  },
} as const
