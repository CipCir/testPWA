import React, { useState } from 'react'

export default function App() {
  const [permission, setPermission] = useState(Notification.permission)
  const [logs, setLogs] = useState([])

  // helper to keep an on-page log (useful on mobile where DevTools aren't available)
  function addLog(level, ...args) {
    try {
      // keep compact readable text for the UI
      const text = args.map(a => {
        if (a === undefined) return 'undefined'
        if (a === null) return 'null'
        if (typeof a === 'string') return a
        try {
          return JSON.stringify(a)
        } catch (e) {
          return String(a)
        }
      }).join(' ')

      const entry = `${new Date().toLocaleTimeString()} [${level}] ${text}`
      setLogs(prev => [entry, ...prev].slice(0, 200))
    } catch (e) {
      // ignore UI log errors
    }

    // also mirror to the real console
    if (level === 'error') console.error(...args)
    else if (level === 'warn') console.warn(...args)
    else console.log(...args)
  }

  async function requestPermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.')
      addLog('warn', 'This browser does not support notifications.')
      return
    }
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      addLog('log', 'Notification permission status:', result)
    } catch (err) {
      addLog('error', err)
    }
  }

  async function sendNotification() {
    addLog('log', 'sendNotification() called')

    // Ensure permission
    addLog('log', 'Current Notification.permission:', Notification.permission)
    if (Notification.permission !== 'granted') {
      addLog('log', 'Requesting notification permission...')
      await requestPermission()
      addLog('log', 'Permission after request:', Notification.permission)
      if (Notification.permission !== 'granted') {
        addLog('warn', 'Notification permission not granted; aborting sendNotification')
        return
      }
    }

    // Try to use the service worker registration to show a notification
    try {
      const reg = await navigator.serviceWorker.getRegistration()
  addLog('log', 'navigator.serviceWorker.getRegistration() returned:', reg)

      const title = '🍺 Happy Halloween! in title tag 🦇🕸️'
      const options = {
        body: 'Happy Halloween! in body tag 🍺🎃🦇🕸️',
        tag: 'halloween-notification',
        renotify: true,
        icon: '/icons/halloween.png', // fallback icon
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Beer_mug.png', // beer image
        data: { time: Date.now() },
        actions: [
          { action: 'open', title: 'Open App 🎃' }
        ]
      }

      if (reg && reg.active && reg.active.postMessage) {
        // Always send notification via service worker for best compatibility
        reg.active.postMessage({ type: 'show-notification', title, options })
        addLog('log', 'Posted message to active service worker (for notification with image)')
      } else if (reg && typeof reg.showNotification === 'function') {
        // Fallback: direct showNotification if postMessage not available
        addLog('log', 'Using ServiceWorkerRegistration.showNotification() (fallback)')
        try {
          await reg.showNotification(title, options)
          addLog('log', 'showNotification() promise resolved')
        } catch (err) {
          addLog('error', 'reg.showNotification threw:', err)
        }
      } else {
        addLog('warn', 'No active service worker to postMessage to; falling back to Notification constructor')
        try {
          const n = new Notification(title, options)
          addLog('log', 'Notification constructor returned:', n)
        } catch (err) {
          addLog('error', 'Notification constructor failed:', err)
        }
      }
    } catch (err) {
      addLog('error', 'Failed during sendNotification flow:', err)
    }
  }

  return (
    <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:320, maxWidth:'90%'}}>
        <button
          onClick={sendNotification}
          style={{fontSize:18,padding:'12px 20px',borderRadius:8,cursor:'pointer',width:'100%'}}
        >
          Send Notification
        </button>
        <div style={{marginTop:12,fontSize:13,color:'#444'}}>Permission: {permission}</div>

        <div style={{marginTop:12,display:'flex',gap:8,alignItems:'center'}}>
          <strong style={{fontSize:13}}>Logs</strong>
          <button onClick={() => setLogs([])} style={{marginLeft:'auto',fontSize:12,padding:'4px 8px'}}>Clear</button>
        </div>

        <div style={{marginTop:8,height:220,overflow:'auto',background:'#111',color:'#0f0',padding:10,borderRadius:6,fontFamily:'monospace',fontSize:12}}>
          {logs.length === 0 ? (
            <div style={{opacity:0.6}}>No logs yet. Click the button to see flow information here.</div>
          ) : (
            logs.map((l, i) => <div key={i} style={{marginBottom:6,whiteSpace:'pre-wrap'}}>{l}</div>)
          )}
        </div>
      </div>
    </div>
  )
}
