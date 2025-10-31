# Simple PWA Notify

A minimal installable React PWA that displays a notification when the single button is pressed.

Features
- Installable PWA (manifest + service worker)
- Single button UI that requests Notification permission and triggers a notification
- Service worker listens to messages and can show notifications

Running locally
1. Install dependencies:

   Set-Location -Path "D:\Git\AI\test"
   npm install

2. Start the dev server:

   Set-Location -Path "D:\Git\AI\test"
   npm run dev

Testing notifications
- Open the dev server URL (likely http://localhost:5173) in Chrome or Edge (desktop or mobile browser that supports PWAs).
- Click the "Send Notification" button.
  - The page will request notification permission if not granted.
  - Once granted, it will show a notification using the service worker registration (or the Notification API as fallback).

Install PWA
- In Chrome/Edge you should see an install prompt in the address bar (or use the browser menu -> Install app).
- Install the app and open it as a standalone app; the notification should still work when the app is foregrounded. Background delivery from a remote server (Push API) is not implemented here but the service worker contains a `push` handler to wire later.

Notes & next steps
- This implementation triggers notifications locally from the client. For real push notifications from a server you would:
  1. Add a push subscription flow (PushManager.subscribe)
  2. Send subscription to your server and use a push service to send push messages
  3. Implement server-side send using Web Push (VAPID keys)

If you want, I can add a small server example showing how to send real push notifications (VAPID), or wire a button to post to a local server that forwards a push message.
