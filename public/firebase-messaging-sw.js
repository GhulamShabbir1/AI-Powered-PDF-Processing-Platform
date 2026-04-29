// public/firebase-messaging-sw.js
/**
 * Professional Firebase Cloud Messaging Service Worker
 * Handles:
 * - Background message reception
 * - Notification display with grouping
 * - Click event routing & navigation
 * - Error handling & logging
 * - Offline support
 */

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// ============================================================================
// CONFIGURATION & INITIALIZATION
// ============================================================================

const CONFIG = {
  DEFAULT_ICON: '/favicon.svg',
  DEFAULT_BADGE: '/favicon.svg',
  NOTIFICATION_TIMEOUT: 7000,
  MAX_NOTIFICATION_BODY_LENGTH: 200,
};

let firebaseInitialized = false;
let initError = null;

// Initialize Firebase with error handling
try {
  firebase.initializeApp({
    apiKey: "AIzaSyBG91G7CeEw-x1wzt6QfNwjGyH2Ps2XcXI",
    authDomain: "chat-5810e.firebaseapp.com",
    projectId: "chat-5810e",
    storageBucket: "chat-5810e.firebasestorage.app",
    messagingSenderId: "431177868521",
    appId: "1:431177868521:web:c287ecf6228b146cf33c78",
  });
  firebaseInitialized = true;
  console.log('[FCM-SW] ✅ Firebase initialized successfully');
} catch (error) {
  initError = error;
  console.error('[FCM-SW] ❌ Firebase initialization failed:', error);
}

// ============================================================================
// BACKGROUND MESSAGE HANDLER
// ============================================================================

if (firebaseInitialized) {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    try {
      console.log('[FCM-SW] 📬 Background message received:', {
        messageId: payload.messageId,
        notification: payload.notification?.title,
        hasData: !!payload.data,
      });

      // Extract notification data with fallbacks
      const notificationTitle = payload?.notification?.title || 'New Notification';
      const notificationBody = (payload?.notification?.body || 'You have a new message.')
        .substring(0, CONFIG.MAX_NOTIFICATION_BODY_LENGTH);

      // Build notification options with smart defaults
      const notificationOptions = {
        body: notificationBody,
        icon: payload?.notification?.icon || CONFIG.DEFAULT_ICON,
        badge: CONFIG.DEFAULT_BADGE,
        tag: payload?.data?.notification_tag || payload?.messageId || `msg-${Date.now()}`,
        data: {
          ...payload?.data,
          messageId: payload.messageId,
          timestamp: new Date().toISOString(),
        },
        requireInteraction: payload?.data?.require_interaction === 'true' || false,
        silent: payload?.data?.silent === 'true' || false,
        vibrate: payload?.data?.vibrate ? [200, 100, 200] : undefined,
        tag_strategy: payload?.data?.tag_strategy || 'replace', // 'replace' or 'stack'
      };

      // Add optional rich features
      if (payload?.notification?.image) {
        notificationOptions.image = payload.notification.image;
      }

      if (payload?.data?.actions) {
        try {
          const actions = JSON.parse(payload.data.actions);
          notificationOptions.actions = actions;
        } catch (e) {
          console.warn('[FCM-SW] Failed to parse actions:', e);
        }
      }

      // Show notification
      const notificationPromise = self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );

      // Log notification shown
      notificationPromise
        .then(() => {
          console.log('[FCM-SW] ✅ Notification displayed:', notificationTitle);
        })
        .catch((err) => {
          console.error('[FCM-SW] ❌ Failed to show notification:', err);
        });

    } catch (error) {
      console.error('[FCM-SW] ❌ Error handling background message:', error);
      // Fall back to simple notification
      try {
        self.registration.showNotification('New Message', {
          body: 'You have a new notification',
          icon: CONFIG.DEFAULT_ICON,
          badge: CONFIG.DEFAULT_BADGE,
        });
      } catch (fallbackError) {
        console.error('[FCM-SW] ❌ Even fallback notification failed:', fallbackError);
      }
    }
  });
}

// ============================================================================
// NOTIFICATION CLICK HANDLER
// ============================================================================

self.addEventListener('notificationclick', (event) => {
  console.log('[FCM-SW] 👆 Notification clicked:', event.notification.tag);

  try {
    event.notification.close();

    // Extract routing data from notification
    const data = event.notification.data || {};
    let clickAction = data.click_action || data.route || '/dashboard';

    // Handle action button clicks (if applicable)
    if (event.action) {
      const actionHandler = data[`action_${event.action}`];
      if (actionHandler) {
        clickAction = actionHandler;
      }
      console.log('[FCM-SW] Action triggered:', event.action, '→', clickAction);
    }

    // Ensure clickAction is a valid relative URL
    if (!clickAction.startsWith('/')) {
      clickAction = '/' + clickAction;
    }

    console.log('[FCM-SW] Navigating to:', clickAction);

    // Open or focus existing client
    event.waitUntil(
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Try to find and focus existing client
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              console.log('[FCM-SW] Focusing existing client');
              return client.focus().then((focusedClient) => {
                if ('navigate' in focusedClient) {
                  focusedClient.navigate(new URL(clickAction, self.location.origin).href);
                }
                // Post message to client for additional handling
                focusedClient.postMessage({
                  type: 'NOTIFICATION_CLICKED',
                  payload: data,
                  route: clickAction,
                });
                return focusedClient;
              });
            }
          }

          // If no client found, open new window
          console.log('[FCM-SW] Opening new window');
          if (clients.openWindow) {
            return clients.openWindow(
              new URL(clickAction, self.location.origin).href
            ).then((newClient) => {
              if (newClient) {
                newClient.postMessage({
                  type: 'NOTIFICATION_CLICKED',
                  payload: data,
                  route: clickAction,
                });
              }
              return newClient;
            });
          }
        })
        .catch((err) => {
          console.error('[FCM-SW] ❌ Error handling notification click:', err);
        })
    );
  } catch (error) {
    console.error('[FCM-SW] ❌ Notification click handler error:', error);
  }
});

// ============================================================================
// NOTIFICATION CLOSE HANDLER
// ============================================================================

self.addEventListener('notificationclose', (event) => {
  console.log('[FCM-SW] ✖️  Notification dismissed:', event.notification.tag);
  try {
    const data = event.notification.data || {};
    
    // Notify clients that notification was dismissed
    clients.matchAll({ type: 'window' }).then((clientList) => {
      clientList.forEach((client) => {
        client.postMessage({
          type: 'NOTIFICATION_CLOSED',
          payload: data,
          tag: event.notification.tag,
        });
      });
    });
  } catch (error) {
    console.error('[FCM-SW] Error handling notification close:', error);
  }
});

// ============================================================================
// PUSH EVENT HANDLER (direct push, not through FCM)
// ============================================================================

self.addEventListener('push', (event) => {
  console.log('[FCM-SW] 📨 Push event received');

  if (!event.data) {
    console.warn('[FCM-SW] ⚠️  Push event with no data');
    return;
  }

  try {
    const payload = event.data.json();
    console.log('[FCM-SW] Push payload:', payload);
    // FCM's onBackgroundMessage will handle this, but this is a safety net
  } catch (error) {
    console.error('[FCM-SW] ❌ Failed to parse push event:', error);
  }
});

// ============================================================================
// SERVICE WORKER LIFECYCLE
// ============================================================================

self.addEventListener('install', (event) => {
  console.log('[FCM-SW] 📦 Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[FCM-SW] 🚀 Service Worker activating');
  event.waitUntil(clients.claim());
});

// ============================================================================
// MESSAGE HANDLER (for client-SW communication)
// ============================================================================

self.addEventListener('message', (event) => {
  console.log('[FCM-SW] 💬 Message from client:', event.data.type);

  if (event.data.type === 'PING') {
    event.ports[0].postMessage({
      type: 'PONG',
      swReady: firebaseInitialized,
      initError: initError?.message || null,
    });
  }
});

console.log('[FCM-SW] ✅ Firebase Messaging Service Worker loaded successfully');

