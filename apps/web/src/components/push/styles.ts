export const PushPromptStyles = {
  container: [
    'fixed bottom-4 left-4 right-4 z-50',
    'mx-auto max-w-sm',
    'rounded-xl bg-zinc-900 border border-zinc-700',
    'p-4 shadow-2xl',
    'animate-in slide-in-from-bottom-4 fade-in duration-300',
  ].join(' '),
  content: 'flex flex-col gap-3',
  text: 'text-sm text-zinc-200',
  actions: 'flex gap-2',
  subscribeButton: [
    'flex-1 rounded-lg px-4 py-2',
    'text-sm font-medium',
    'bg-white text-black',
    'hover:bg-zinc-200',
    'disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  ].join(' '),
  dismissButton: [
    'rounded-lg px-4 py-2',
    'text-sm font-medium',
    'text-zinc-400',
    'hover:text-zinc-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  ].join(' '),
} as const
