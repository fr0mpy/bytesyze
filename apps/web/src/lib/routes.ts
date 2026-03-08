export const Routes = {
  home: '/',
  settings: '/settings',
  card: (id: string) => `/card/${id}`,
  admin: '/admin',
  adminFlagged: '/admin/flagged',
  api: {
    cards: '/api/cards',
    card: (id: string) => `/api/cards/${id}`,
    events: '/api/events',
    og: '/api/og',
  },
} as const
