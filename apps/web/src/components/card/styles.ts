import type { CardCategory } from '@/lib/supabase/types'

export const CategoryColors: Record<CardCategory, string> = {
  OpenAI: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Anthropic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Google: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Meta: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'Open Source': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Research: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  Startups: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  Tools: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Policy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Industry: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
} as const

export const CardStyles = {
  container: [
    'rounded-2xl shadow-md',
    'bg-white dark:bg-zinc-900',
    'border border-zinc-200 dark:border-zinc-800',
    'overflow-hidden transition-shadow duration-200',
    'hover:shadow-lg',
  ].join(' '),
  header: 'flex items-center justify-between gap-2 px-4 pt-4 pb-2',
  badge: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  time: 'text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap',
  titleContainer: 'px-4 pb-3',
  title: 'text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100',
  sourceRow: [
    'flex items-center gap-1.5 px-4 pb-4',
    'text-xs text-zinc-500 dark:text-zinc-400',
  ].join(' '),
  sourceLabel: 'font-medium',
  sourceName: 'underline underline-offset-2',
  expandedSection: 'px-4 pb-4 space-y-3',
  teaser: 'text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed',
  keyPointsHeading: 'text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400',
  keyPointsList: 'list-disc list-inside space-y-1',
  keyPoint: 'text-sm text-zinc-700 dark:text-zinc-300',
  readMoreLink: [
    'inline-flex items-center gap-1 text-sm font-medium',
    'text-blue-600 dark:text-blue-400',
    'hover:underline',
  ].join(' '),
  visualContainer: 'px-4 pb-4',
} as const

export const VisualStyles = {
  container: [
    'rounded-xl p-4',
    'bg-zinc-50 dark:bg-zinc-800/50',
    'border border-zinc-200 dark:border-zinc-700',
  ].join(' '),
  barContainer: 'space-y-2',
  barRow: 'flex items-center gap-2',
  barLabel: 'text-xs text-zinc-600 dark:text-zinc-300 w-20 shrink-0 truncate',
  barTrack: 'flex-1 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden',
  barFill: 'h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-300',
  barValue: 'text-xs text-zinc-500 dark:text-zinc-400 w-10 text-right shrink-0',
  statValue: 'text-3xl font-bold text-zinc-900 dark:text-zinc-100 text-center',
  statLabel: 'text-sm text-zinc-500 dark:text-zinc-400 text-center mt-1',
  vsContainer: 'grid grid-cols-2 gap-4',
  vsColumn: 'flex flex-col items-center gap-1',
  vsLabel: 'text-sm font-medium text-zinc-700 dark:text-zinc-300',
  vsValue: 'text-2xl font-bold text-zinc-900 dark:text-zinc-100',
  vsDivider: 'text-lg font-bold text-zinc-400 dark:text-zinc-500 self-center',
  linePlaceholder: [
    'h-20 w-full rounded-lg',
    'bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100',
    'dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-900/30',
  ].join(' '),
} as const
