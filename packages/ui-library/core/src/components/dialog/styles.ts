export const DialogStyles = {
  backdrop: 'fixed inset-0 z-modal bg-foreground/80 backdrop-blur-sm cursor-pointer',
  backdropBlocking: 'cursor-not-allowed',
  portal: 'fixed inset-0 z-modal flex items-center justify-center p-4 pointer-events-none',
  content: 'relative z-modal w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg rounded-theme-lg sm:rounded-theme-xl p-4 sm:p-6 bg-neu-base shadow-neu-raised-lg pointer-events-auto',
  header: 'flex flex-col space-y-1.5 pb-4',
  title: 'font-heading text-lg font-semibold text-foreground',
  description: 'text-sm text-muted-foreground',
  footer: 'flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end pt-4',
  closeButton: 'absolute right-4 top-4 h-8 w-8 min-h-8 min-w-8 p-0',
  closeIcon: 'h-4 w-4',
} as const
