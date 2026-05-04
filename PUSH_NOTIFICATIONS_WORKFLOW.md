# Push Notifications Workflow

This document explains the end-to-end web push notification workflow used in this project (Firebase Cloud Messaging — FCM). Each step explains what happens, where the code lives in this repo, and best-practice notes.

---

## Quick Overview: How FCM Tokens Work

```
┌─────────────────────────────────────────────────────────────┐
│ USER'S BROWSER (Client)                                     │
├─────────────────────────────────────────────────────────────┤
│ 1. User grants notification permission                      │
│ 2. App calls: getToken(messaging, { vapidKey })             │
│    ↓                                                         │
│ 3. Firebase servers generate UNIQUE TOKEN for this browser   │
│    ↓                                                         │
│ 4. Token stored in localStorage (e.g., "d_FIazaB...")      │
│ 5. App sends token to backend API                           │
└───────────────────┬───────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Your Server)                                       │
├─────────────────────────────────────────────────────────────┤
│ 6. Store: User 123 → Token "d_FIazaB..."                   │
│    (in database, allows targeting by user)                 │
│ 7. Later: "Send notification to User 123"                  │
│    ↓                                                         │
│ 8. Lookup User 123's token, call Firebase FCM API           │
│    POST to: https://fcm.googleapis.com/v1/projects/...      │
│    with: { token: "d_FIazaB...", title: "...", body: "..." }│
└───────────────────┬───────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ FIREBASE SERVERS                                            │
├─────────────────────────────────────────────────────────────┤
│ 9. Validate token belongs to the right app (via vapidKey)   │
│ 10. Route notification to the correct device/browser        │
└─────────────────────────────────────────────────────────────┘
```

**Key point**: You don't "create" a token — **Firebase creates it** when your app asks for it.

---

## 1. Firebase project & credentials

- **What**: Create a Firebase project and enable Cloud Messaging. Obtain the Web Push certificate (VAPID key) / server key as required by FCM.
- **Why**: FCM needs project credentials to authenticate sender requests and issue client tokens.
- **Repo references**: [src/config/firebase.ts](src/config/firebase.ts)

### VAPID key explained:

A **VAPID key** (Voluntary Application Server Identification) is a pair of public/private keys:
- **Public VAPID key** (in your client code): Tells Firebase/browsers "this app is legitimate"
- **Private VAPID key** (on your server only): Used by your backend to sign notification requests to Firebase

Where they come from:
1. Go to **Firebase Console** → Your Project → **Cloud Messaging** tab
2. Find **Web Push Certificates** section
3. Click **Generate Key Pair** → Copy the **public key** to your `.env.local`:
   ```env
   VITE_FIREBASE_VAPID_KEY=YOUR_PUBLIC_KEY_HERE
   ```
4. Firebase also gives you a **server key** (private) — store it securely on your backend (never in client code)

In your code:
```ts
// src/config/firebase.ts
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// src/services/notification.service.ts
const currentToken = await getToken(messaging, {
  vapidKey: VAPID_KEY  // ← Your public VAPID key from .env
});
```

Notes:
- Store server keys securely (server environment variables). Do NOT commit server keys to the repo.
- If `VAPID_KEY` is missing, `getToken()` may return `null`.

## 2. Register Service Worker (background handling)

- What: Register a `firebase-messaging-sw.js` service worker to receive push messages when the web app is in the background or closed.
- Why: Browsers deliver push messages to service workers for background display and click handling.
- Repo references: [public/firebase-messaging-sw.js](public/firebase-messaging-sw.js)

Typical actions inside the service worker:
- Listen for `push` events and show notifications with `self.registration.showNotification()`.
- Handle `notificationclick` to focus/open application windows and route the user to the right screen.

## 3. Ask user permission (notification consent)

- What: Prompt the user to grant notification permission via `Notification.requestPermission()`.
- Why: Browsers require explicit user consent for notifications.
- Where: Client UI / a composable that triggers permission UX (see `useServiceWorker` and `useNotifications` patterns).
- Repo references: [src/composables/useServiceWorker.ts](src/composables/useServiceWorker.ts) and [src/composables/useNotifications.ts](src/composables/useNotifications.ts) (or similar composables)

Example (simplified):
```js
const permission = await Notification.requestPermission();
if (permission !== 'granted') {
  // show UI explaining why notifications help
}
```

## 4. Obtain FCM registration token (client identifier)

**You do NOT create a token — Firebase generates it automatically.**

### How it works:

1. **Firebase generates the token**: When you call `getToken(messaging, { vapidKey })`, the Firebase Messaging SDK:
   - Contacts Firebase servers with your app's `projectId` and VAPID key
   - Firebase validates your app and generates a **unique token** for this browser/device combo
   - The token is tied to the browser instance, not the user (so each browser tab/device gets its own)

2. **Token is a random string**: Example format (128+ chars):
   ```
   d_FIazaBxyz1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ...
   ```

3. **Send token to your backend**: Once you have the token, your app must send it to your backend API, where it's stored with the user ID so the backend knows which token to target when sending notifications.

### In your codebase:

**File**: [src/services/notification.service.ts](src/services/notification.service.ts) — `getCurrentToken()` method:
```ts
async getCurrentToken(): Promise<string | null> {
  const messaging = await getMessagingInstance(); // Init Firebase Messaging
  
  const currentToken = await getToken(messaging, {
    vapidKey: VAPID_KEY  // Uses VITE_FIREBASE_VAPID_KEY env var
  });
  
  // Token is now in `currentToken`
  return currentToken;
}
```

**What the token looks like in storage**:
- Browser local storage key: `fcm_token_value`
- Server database: `User.fcmToken` (or similar schema) — maps user ID → token

### Token lifecycle:

| Event | Happens | Action |
|-------|---------|--------|
| First permission grant | Firebase generates token | App sends to backend |
| User clears browser storage | Token deleted locally | Need to re-request permission & get new token |
| ~1 month of inactivity | Firebase expires token | Firebase rotates automatically (onTokenRefresh event) |
| User uninstalls app / clears data | Local token & backend token become stale | Backend should retry sends and clean up invalid tokens |

### Reference:
- Firebase config (keys): [src/config/firebase.ts](src/config/firebase.ts)
- Token retrieval: [src/services/notification.service.ts](src/services/notification.service.ts)
- Initialization: [src/composables/useServiceWorker.ts](src/composables/useServiceWorker.ts) (registers SW, then notification service gets token)

## 5. Persist tokens and map to users (server)

- What: Store the FCM token along with the user id or device metadata on your server.
- Why: To target notifications per-user or per-device from backend systems.
- Repo references: See server-side guidance in [PUSH_NOTIFICATIONS_IMPLEMENTATION.md](PUSH_NOTIFICATIONS_IMPLEMENTATION.md) (server implementation is outside this frontend repo).

Notes:
- Tokens can expire or be refreshed; track token lifecycle and handle deletions.

## 6. Sending notifications (server or cloud functions)

- What: The server (or Firebase Cloud Function) composes a notification payload and calls FCM HTTP API (or Firebase Admin SDK) to deliver to tokens.
- Why: Only trusted servers should hold server keys and initiate push deliveries.

Payload types:
- Notification message (predefined fields): shown automatically by the browser when app is backgrounded.
- Data message: handled by client code and can trigger custom behavior.

High-level server flow:
- Authenticate to FCM (server key or Admin SDK).
- Select tokens (single or topic/group).
- POST payload to FCM endpoint. Handle response results (invalid tokens, unregistered tokens), and clean up stale tokens.

## 7. Foreground message handling (client)

- What: When the app is open and in the foreground, `onMessage()` gets invoked for incoming messages. The client can show in-app UI or trigger local notifications.
- Why: Browser won’t automatically display notification UI when app is foreground; client must decide.
- Repo references: [`src/composables/useNotifications.ts`](src/composables/useNotifications.ts) or `notification.service.ts` implementations.

Example (simplified):
```js
onMessage(messaging, (payload) => {
  // show in-app toast or custom notification
});
```

## 8. Token refresh and cleanup

- What: FCM tokens may rotate; listen for token refresh events and update the server copy. Remove invalid tokens when FCM returns errors.
- Why: Prevents wasted sends and ensures messages reach active devices.

Notes:
- Regularly check send responses for errors like `notRegistered` or `invalidRegistration` and remove tokens accordingly.

## 9. User preferences & subscription management

- What: Let users toggle notification categories (e.g., alerts, reminders). Store preferences server-side and use them when selecting tokens/targets for a notification send.

Design tips:
- Map notification types to topics or to server-side filtering rules.
- Provide clear UI to opt-in/out and explain consequences.

## 10. Security & privacy

- Keep server keys and VAPID private and out of the client repository.
- Request only necessary notification permissions and be transparent about usage.
- Use short-lived tokens or rotate keys when needed.

## 11. Troubleshooting

- No permission prompt: ensure prompt is triggered by a user gesture and not spammed.
- Token null/empty: check Firebase initialization and VAPID key; ensure service worker registered and scope correct.
- Messages not delivered: check server FCM response for errors and verify tokens.

## 12. Repo files & further reading

- Project push notification guide: [PUSH_NOTIFICATIONS_GUIDE.md](PUSH_NOTIFICATIONS_GUIDE.md)
- Implementation notes: [PUSH_NOTIFICATIONS_IMPLEMENTATION.md](PUSH_NOTIFICATIONS_IMPLEMENTATION.md)
- Service worker: [public/firebase-messaging-sw.js](public/firebase-messaging-sw.js)
- Firebase client config: [src/config/firebase.ts](src/config/firebase.ts)
- Client helpers/composables: [src/composables/useServiceWorker.ts](src/composables/useServiceWorker.ts) and [src/composables/useNotifications.ts](src/composables/useNotifications.ts)
- Notification service client: [src/services/notification.service.ts](src/services/notification.service.ts)

---

If you want, I can:
- Add short code examples wired to this repo's `src/config/firebase.ts` values.
- Create a short checklist for deploying server-side senders and Cloud Functions.
