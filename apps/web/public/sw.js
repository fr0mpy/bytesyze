// Service worker placeholder - will be replaced with Serwist configuration
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
})
