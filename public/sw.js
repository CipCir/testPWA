// Simple service worker that can show notifications triggered from the page
self.addEventListener('install', (event) => {
    console.log('[sw] install')
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    console.log('[sw] activate')
    event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
    // Expect event.data to be { type: 'show-notification', title, options }
    const data = event.data || {}
    console.log('[sw] message received:', data)
    if (data && data.type === 'show-notification') {
        const title = data.title || 'Notification'
        const options = data.options || {}
        self.registration.showNotification(title, options)
        console.log('[sw] showNotification called with', title, options)
    }
})

// Optional: respond to push events (if later you wire a real push server)
self.addEventListener('push', (event) => {
    console.log('[sw] push event')
    const payload = event.data ? event.data.text() : 'You have a new message.'
    const title = 'Push: New message'
    const options = {
        body: payload
    }
    event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
    console.log('[sw] notificationclick, action:', event.action)
    event.notification.close()
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            console.log('[sw] clients matched:', clientList.length)
            if (clientList.length > 0) {
                let client = clientList[0]
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i]
                    }
                }
                return client.focus()
            }
            return clients.openWindow('/')
        })
    )
})
