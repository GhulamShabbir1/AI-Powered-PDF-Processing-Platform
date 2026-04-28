// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBG91G7CeEw-x1wzt6QfNwjGyH2Ps2XcXI",
  authDomain: "chat-5810e.firebaseapp.com",
  projectId: "chat-5810e",
  storageBucket: "chat-5810e.firebasestorage.app",
  messagingSenderId: "431177868521",
  appId: "1:431177868521:web:c287ecf6228b146cf33c78",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload?.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload?.notification?.body || 'You have a new message.',
    icon: payload?.notification?.icon || '/favicon.svg',
    badge: '/favicon.svg',
    tag: payload?.messageId || 'general',
    data: payload?.data || {},
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks — open/focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickAction = event.notification?.data?.click_action || event.notification?.click_action || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then((focusedClient) => {
              if ('navigate' in focusedClient) {
                focusedClient.navigate(clickAction);
              }
              return focusedClient;
            });
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
      .catch((err) => {
        console.error('[firebase-messaging-sw.js] Error handling notification click:', err);
      })
  );
});

