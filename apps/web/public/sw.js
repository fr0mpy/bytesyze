// Service worker for bytesyze.ai — handles push notifications
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
})

// Handle incoming push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'bytesyze.ai', body: event.data.text() }
  }

  const options = {
    body: payload.body || '',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: { url: payload.url || '/' },
    vibrate: [100, 50, 100],
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'bytesyze.ai', options)
  )
})

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Otherwise open new tab
      return self.clients.openWindow(url)
    })
  )
})
