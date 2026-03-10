export const CategoryFilterStyles = {
  container: [
    'sticky top-0 z-20',
    'bg-black/90 backdrop-blur-sm',
    'border-b border-zinc-800',
  ].join(' '),
  scrollArea: [
    'flex gap-2 overflow-x-auto px-4 py-3',
    'scrollbar-none',
    '-webkit-overflow-scrolling-touch',
  ].join(' '),
  chip: [
    'shrink-0 rounded-full px-3 py-1.5',
    'text-xs font-medium',
    'bg-zinc-800 text-zinc-300',
    'hover:bg-zinc-700',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  ].join(' '),
  chipActive: [
    'shrink-0 rounded-full px-3 py-1.5',
    'text-xs font-medium',
    'bg-white text-black',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  ].join(' '),
} as const
