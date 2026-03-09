export const AdminLayoutStyles = {
  container: 'min-h-screen bg-gray-50',
  header: [
    'border-b border-gray-200 bg-white',
    'px-6 py-4',
  ].join(' '),
  heading: 'text-2xl font-bold text-gray-900',
  main: 'p-6',
  authContainer: [
    'flex min-h-screen items-center justify-center',
    'bg-gray-50',
  ].join(' '),
  authForm: [
    'w-full max-w-sm rounded-lg bg-white',
    'p-8 shadow-md',
  ].join(' '),
  authTitle: 'mb-6 text-xl font-semibold text-gray-900',
  authInput: [
    'mb-4 w-full rounded-md border border-gray-300',
    'px-3 py-2 text-sm',
    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
  ].join(' '),
  authButton: [
    'w-full rounded-md bg-blue-600 px-4 py-2',
    'text-sm font-medium text-white',
    'hover:bg-blue-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ].join(' '),
  authError: 'mb-4 text-sm text-red-600',
} as const

export const AdminDashboardStyles = {
  container: 'space-y-8',
  sectionTitle: 'text-lg font-semibold text-gray-900',
  statsGrid: 'grid grid-cols-1 gap-4 sm:grid-cols-3',
  statCard: [
    'rounded-lg border border-gray-200 bg-white',
    'p-6 shadow-sm',
  ].join(' '),
  statLabel: 'text-sm font-medium text-gray-500',
  statValue: 'mt-1 text-3xl font-bold text-gray-900',
  linkSection: 'mt-8',
  link: [
    'inline-flex items-center rounded-md bg-blue-600',
    'px-4 py-2 text-sm font-medium text-white',
    'hover:bg-blue-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ].join(' '),
} as const

export const AdminFlaggedStyles = {
  container: 'space-y-4',
  title: 'text-lg font-semibold text-gray-900',
  emptyState: [
    'rounded-lg border border-dashed border-gray-300',
    'p-12 text-center',
  ].join(' '),
  emptyText: 'text-sm text-gray-500',
  backLink: [
    'inline-flex items-center text-sm font-medium',
    'text-blue-600 hover:text-blue-800',
  ].join(' '),
} as const

export const AdminErrorStyles = {
  container: [
    'flex flex-col items-center justify-center',
    'min-h-[50vh] gap-4 p-8',
  ].join(' '),
  heading: 'text-xl font-semibold text-gray-900',
  message: 'text-sm text-gray-500',
  button: [
    'rounded-md bg-blue-600 px-4 py-2',
    'text-sm font-medium text-white',
    'hover:bg-blue-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ].join(' '),
} as const

export const AdminLoadingStyles = {
  container: 'space-y-8 p-6',
  statsGrid: 'grid grid-cols-1 gap-4 sm:grid-cols-3',
  skeleton: 'h-24 animate-pulse rounded-lg bg-gray-200',
  skeletonWide: 'h-10 w-48 animate-pulse rounded-md bg-gray-200',
} as const
