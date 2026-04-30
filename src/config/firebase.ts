import { getAnalytics } from 'firebase/analytics';

import { initializeApp } from 'firebase/app';

import { getMessaging, isSupported } from 'firebase/messaging';

export const firebaseConfig = {

apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

appId: import.meta.env.VITE_FIREBASE_APP_ID,

measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional, works in browser)

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Cloud Messaging and get a reference to the service

let messagingInstance: any = null;

/**

* Safely gets the messaging instance.

* Returns null if the browser context doesn't support it (e.g., HTTP).

*/

export async function getMessagingInstance() {

if (messagingInstance) return messagingInstance;


try {

const supported = await isSupported();

if (supported) {

messagingInstance = getMessaging(app);

}

} catch (err) {

console.warn("Firebase Messaging not supported in this context:", err);

}

return messagingInstance;

}

/**

* Exported specifically to satisfy imports in notification services.

* Checks if the current browser/protocol supports FCM.

*/

export async function isMessagingSupported(): Promise<boolean> {

try {

return await isSupported();

} catch {

return false;

}

}

// Default export of the app instance

export default app;