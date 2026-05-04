importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js')

const CONFIG = {
  DEFAULT_ICON: '/favicon.svg',
  DEFAULT_BADGE: '/favicon.svg',
  MAX_NOTIFICATION_BODY_LENGTH: 200,
}

let firebaseInitialized = false
let initError = null

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyBG91G7CeEw-x1wzt6QfNwjGyH2Ps2XcXI',
    authDomain: 'chat-5810e.firebaseapp.com',
    projectId: 'chat-5810e',
    storageBucket: 'chat-5810e.firebasestorage.app',
    messagingSenderId: '431177868521',
    appId: '1:431177868521:web:c287ecf6228b146cf33c78',
  })
  firebaseInitialized = true
  console.log('[FCM-SW] Firebase initialized successfully')
} catch (error) {
  initError = error
  console.error('[FCM-SW] Firebase initialization failed:', error)
}

function isProgressPayload(payload) {
  const type = payload?.data?.notification_type || payload?.data?.type || ''
  const tag = payload?.data?.notification_tag || ''

  return type === 'progress' || type === 'processing-progress' || tag.startsWith('progress-')
}

async function hasVisibleClient() {
  const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true })
  return clientList.some((client) => client.visibilityState === 'visible')
}

async function broadcastToClients(message) {
  const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true })
  await Promise.all(clientList.map((client) => client.postMessage(message)))
}

function buildNotificationOptions(payload) {
  const notificationBody = (payload?.notification?.body || 'You have a new message.')
    .substring(0, CONFIG.MAX_NOTIFICATION_BODY_LENGTH)

  const notificationOptions = {
    body: notificationBody,
    icon: payload?.notification?.icon || CONFIG.DEFAULT_ICON,
    badge: CONFIG.DEFAULT_BADGE,
    tag: payload?.data?.notification_tag || payload?.messageId || `msg-${Date.now()}`,
    data: {
      ...payload?.data,
      messageId: payload?.messageId,
      timestamp: new Date().toISOString(),
    },
    requireInteraction: payload?.data?.require_interaction === 'true',
    silent: payload?.data?.silent === 'true',
  }

  if (payload?.notification?.image) {
    notificationOptions.image = payload.notification.image
  }

  if (payload?.data?.actions) {
    try {
      notificationOptions.actions = JSON.parse(payload.data.actions)
    } catch (error) {
      console.warn('[FCM-SW] Failed to parse actions:', error)
    }
  }

  return notificationOptions
}

if (firebaseInitialized) {
  const messaging = firebase.messaging()

  messaging.onBackgroundMessage(async (payload) => {
    try {
      console.log('[FCM-SW] Background message received:', {
        messageId: payload?.messageId,
        title: payload?.notification?.title,
        hasData: !!payload?.data,
      })

      if (isProgressPayload(payload)) {
        console.log('[FCM-SW] Progress payload suppressed')
        await broadcastToClients({
          type: 'FCM_BACKGROUND_SUPPRESSED',
          payload,
          reason: 'progress',
        })
        return
      }

      if (await hasVisibleClient()) {
        console.log('[FCM-SW] Visible client detected, suppressing background notification')
        await broadcastToClients({
          type: 'FCM_BACKGROUND_SUPPRESSED',
          payload,
          reason: 'visible-client',
        })
        return
      }

      const notificationTitle = payload?.notification?.title || 'New Notification'
      const notificationOptions = buildNotificationOptions(payload)
      await self.registration.showNotification(notificationTitle, notificationOptions)
      console.log('[FCM-SW] Notification displayed:', notificationTitle)
    } catch (error) {
      console.error('[FCM-SW] Error handling background message:', error)
    }
  })
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data || {}
  let clickAction = data.click_action || data.route || '/dashboard'

  if (event.action) {
    const actionHandler = data[`action_${event.action}`]
    if (actionHandler) {
      clickAction = actionHandler
    }
  }

  if (!clickAction.startsWith('/')) {
    clickAction = `/${clickAction}`
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then((focusedClient) => {
            if ('navigate' in focusedClient) {
              focusedClient.navigate(new URL(clickAction, self.location.origin).href)
            }
            focusedClient.postMessage({
              type: 'NOTIFICATION_CLICKED',
              payload: data,
              route: clickAction,
            })
            return focusedClient
          })
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(new URL(clickAction, self.location.origin).href).then((newClient) => {
          if (newClient) {
            newClient.postMessage({
              type: 'NOTIFICATION_CLICKED',
              payload: data,
              route: clickAction,
            })
          }
          return newClient
        })
      }

      return undefined
    })
  )
})

self.addEventListener('notificationclose', (event) => {
  const data = event.notification.data || {}

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      clientList.forEach((client) => {
        client.postMessage({
          type: 'NOTIFICATION_CLOSED',
          payload: data,
          tag: event.notification.tag,
        })
      })
    })
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  try {
    console.log('[FCM-SW] Push payload received')
    event.data.json()
  } catch (error) {
    console.error('[FCM-SW] Failed to parse push event:', error)
  }
})

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'PING') {
    event.ports[0].postMessage({
      type: 'PONG',
      swReady: firebaseInitialized,
      initError: initError?.message || null,
    })
  }
})
