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
  // Customize notification here
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message.',
    icon: '/favicon.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
