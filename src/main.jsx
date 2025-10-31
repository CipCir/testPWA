import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// Register service worker for PWA + notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('Service worker registered:', reg)
    } catch (err) {
      console.error('Service worker registration failed:', err)
    }
  })
}
