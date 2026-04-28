# 📬 Push Notifications — Complete Implementation Guide

## Table of Contents
1. [What This Does (Big Picture)](#what-this-does-big-picture)
2. [The Complete Flow (Step by Step)](#the-complete-flow-step-by-step)
3. [Files & Their Roles](#files--their-roles)
4. [How Each Function Works](#how-each-function-works)
5. [Data Flow Diagram](#data-flow-diagram)
6. [Backend Requirements](#backend-requirements)
7. [Environment Variables](#environment-variables)
8. [How to Use in Components](#how-to-use-in-components)
9. [Troubleshooting](#troubleshooting)

---

## What This Does (Big Picture)

When a user logs into your app, we:
1. **Ask the browser** for permission to show notifications
2. **Generate a unique token** from Firebase (FCM Token)
3. **Send that token to YOUR backend** so the server knows where to send push messages
4. **Listen for messages** — when the server sends a push, we show it to the user

This works when:
- ✅ The app is open (foreground) → shows a toast notification
- ✅ The app is closed/minimized (background) → shows a native browser notification

---

## The Complete Flow (Step by Step)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. USER LOGS IN                                                            │
│     ↓                                                                       │
│     auth.store.ts calls notificationService.initPushNotifications()         │
│     (this happens automatically, doesn't block login)                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. CHECK BROWSER SUPPORT                                                   │
│     ↓                                                                       │
│     isMessagingSupported() — "Can this browser do push notifications?"     │
│     • Chrome → ✅ YES                                                       │
│     • Firefox → ✅ YES                                                      │
│     • Safari (iOS) → ❌ NO (not supported)                                  │
│     • Private/Incognito mode → ❌ MAYBE NOT                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. CHECK PERMISSION STATUS                                                 │
│     ↓                                                                       │
│     Notification.permission tells us:                                       │
│     • "granted" → User already said YES → go get token                     │
│     • "default" → User hasn't decided yet → WAIT for explicit action        │
│     • "denied" → User said NO → do nothing, respect their choice            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. GENERATE FCM TOKEN (if permission = granted)                           │
│     ↓                                                                       │
│     getToken(messaging, { vapidKey })                                       │
│     ↓                                                                       │
│     Returns a long string like:                                             │
│     "fK1aB2cD3eF4..." (this is your device's unique address)                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. SEND TOKEN TO BACKEND                                                   │
│     ↓                                                                       │
│     POST /api/fcm/token                                                     │
│     Body: { token, userId, deviceInfo }                                     │
│     ↓                                                                       │
│     Backend saves: "User #42 uses device Chrome-on-Windows with token XYZ"  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  6. LISTEN FOR MESSAGES (always active after init)                          │
│     ↓                                                                       │
│     FOREGROUND (app is open):                                               │
│     • onMessage() fires → shows a toast popup                               │
│     ↓                                                                       │
│     BACKGROUND (app is closed):                                             │
│     • Service Worker catches it → shows native browser notification         │
│     • User clicks notification → opens the app                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Files & Their Roles

### 1. `src/config/firebase.ts` — Firebase Setup
**What it does:** Connects your app to Firebase Cloud Messaging (FCM).

```typescript
// This initializes Firebase with your project credentials
const app = initializeApp(firebaseConfig);

// This gets the messaging instance (only if browser supports it)
export async function getMessagingInstance() { ... }

// This checks if push is supported (returns true/false)
export function isMessagingSupported(): Promise<boolean> { ... }
```

**Key exports:**
| Export | Purpose |
|--------|---------|
| `app` | The Firebase app instance |
| `messaging` | Direct messaging instance (legacy, still works) |
| `getMessagingInstance()` | Safe way to get messaging (checks support first) |
| `isMessagingSupported()` | Check if browser can do push notifications |

---

### 2. `src/services/notification.service.ts` — The Brain
**What it does:** Contains ALL the logic for push notifications. This is the most important file.

**Class:** `NotificationService`

| Method | What It Does | When Called |
|--------|-------------|-------------|
| `isSupported()` | Checks if browser supports FCM | Before any FCM operation |
| `requestPermission()` | Shows browser's "Allow notifications?" popup | When user clicks "Enable Notifications" button |
| `getCurrentToken()` | Gets the FCM token from Firebase | When we need the token |
| `getAndSaveToken()` | Gets token + sends to backend (only if new/changed) | After permission granted |
| `sendTokenToBackend()` | POSTs token to your server | Inside getAndSaveToken() |
| `unregisterToken()` | Removes token from backend + deletes locally | On logout |
| `deleteToken()` | Deletes token from Firebase + localStorage | Part of unregisterToken() |
| `initPushNotifications()` | Main setup: checks support, sets up listener, gets token | On login / app mount |
| `enableNotifications()` | Full flow: request permission → get token → init | User clicks "Enable" button |
| `isSubscribed()` | Returns true if user has granted permission AND token sent | For UI state |
| `getDeviceInfo()` | Detects browser + OS (e.g., "Chrome on Windows") | Sent with token to backend |

**How `initPushNotifications()` works internally:**
```typescript
async initPushNotifications() {
  // Step 1: Already initialized? Skip.
  if (this.initialized) return;

  // Step 2: Browser supports FCM?
  const supported = await this.isSupported();
  if (!supported) {
    console.warn("Not supported");
    return;
  }

  // Step 3: Set up listener for foreground messages
  onMessage(messaging, (payload) => {
    // Show toast notification
    toast.info(`${title}: ${body}`);
  });

  // Step 4: Permission already granted?
  if (Notification.permission === 'granted') {
    await this.getAndSaveToken(); // Get token, send to backend
  }
  // If "default" → do nothing (wait for user to click enable)
  // If "denied" → do nothing (respect user's choice)
}
```

**Token deduplication logic:**
```typescript
async getAndSaveToken() {
  const currentToken = await this.getCurrentToken(); // e.g., "abc123"
  const previouslySent = localStorage.getItem('fcm_token_value'); // e.g., "abc123"

  if (previouslySent === currentToken) {
    console.log("Token unchanged, skip backend call");
    return currentToken; // Don't spam backend with same token
  }

  // Only send if token is NEW or CHANGED
  await this.sendTokenToBackend(currentToken);
  localStorage.setItem('fcm_token_value', currentToken);
}
```

**Error handling for missing backend:**
```typescript
catch (error: any) {
  const status = error?.response?.status;
  if (status === 404) {
    console.warn("Backend endpoint not found. Please implement /fcm/token");
  } else if (status === 401) {
    console.warn("Unauthorized — user needs to re-login");
  } else {
    console.error("Other error:", error?.message);
  }
}
```

---

### 3. `public/firebase-messaging-sw.js` — Background Worker
**What it does:** This is a Service Worker. It runs EVEN WHEN YOUR APP IS CLOSED.

**Why we need it:**
- When the app is closed, the browser can't run your Vue code
- So Firebase sends the message to the Service Worker instead
- The Service Worker shows the native notification

**What happens when a push arrives while app is closed:**
```javascript
messaging.onBackgroundMessage((payload) => {
  // payload = { notification: { title, body, icon }, data: { ... } }

  // Show native browser notification
  self.registration.showNotification("New Message", {
    body: "You have a new notification",
    icon: "/favicon.svg"
  });
});
```

**What happens when user CLICKS the notification:**
```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Hide the notification

  // Try to focus existing tab
  clients.matchAll({ type: 'window' }).then((clientList) => {
    for (const client of clientList) {
      if (client.url.includes('myapp.com')) {
        return client.focus(); // Focus existing tab
      }
    }
    // No existing tab? Open a new one
    clients.openWindow('/');
  });
});
```

---

### 4. `src/stores/auth.store.ts` — Login Integration
**What it does:** Automatically starts push notification setup after login/register.

**After Login:**
```typescript
async login(email, password) {
  const data = await authService.login({ email, password });

  // Save user data
  this.token = data.access_token;
  this.user = data.user;
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user_id', data.user.id);

  // 🔔 START push notifications (non-blocking)
  notificationService.initPushNotifications().catch((e) => {
    console.warn("Push notification init failed:", e);
  });
  // ^ The .catch() ensures login NEVER fails because of push issues
}
```

**After Logout:**
```typescript
async logout() {
  // 🧹 CLEAN UP: Remove token so server stops sending pushes
  await notificationService.unregisterToken();

  await authService.logout();

  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_id');
  // ... etc
}
```

---

### 5. `src/App.vue` — App Mount Integration
**What it does:** If user was already logged in (page refresh), re-init push notifications.

```typescript
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await notificationService.initPushNotifications();
    } catch (e) {
      console.error("Failed to init push notifications:", e);
    }
  }
});
```

**Why:** If user refreshes the page, they're still logged in but `login()` wasn't called. So we need to check on app mount.

---

### 6. `src/composables/useNotifications.ts` — For Vue Components
**What it does:** Reactive composable so components can show "Enable Notifications" buttons.

**Usage in a Vue component:**
```vue
<template>
  <div>
    <v-btn
      v-if="!isSubscribed && canSubscribe"
      @click="enableNotifications"
    >
      🔔 Enable Notifications
    </v-btn>
    <v-chip v-else-if="isSubscribed" color="success">
      ✅ Notifications On
    </v-chip>
    <v-chip v-else color="error">
      ❌ Notifications Blocked
    </v-chip>
  </div>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications';

const { isSupported, isSubscribed, canSubscribe, enableNotifications } = useNotifications();
</script>
```

**What `useNotifications` provides:**
| Property/Method | Type | Description |
|----------------|------|-------------|
| `isSupported` | `ref<boolean>` | Can this browser do push? |
| `permission` | `ref<string>` | "granted" / "denied" / "default" |
| `isSubscribed` | `ref<boolean>` | Has user enabled AND token sent? |
| `hasSentToken` | `ref<boolean>` | Was token successfully sent to backend? |
| `canSubscribe` | `computed<boolean>` | Can the user still enable notifications? |
| `requestPermission()` | `async function` | Ask browser for permission |
| `enableNotifications()` | `async function` | Full flow: permission → token → init |
| `unregister()` | `async function` | Disable notifications |
| `refreshState()` | `function` | Manually refresh all state |

---

### 7. `src/types/notification.types.ts` — TypeScript Types
**What it does:** Defines the shape of data for TypeScript type safety.

```typescript
export interface FcmNotificationPayload {
  title?: string;    // "New Document Ready"
  body?: string;     // "Your PDF has been processed"
  icon?: string;     // URL to icon image
  image?: string;    // URL to large image
  click_action?: string; // Where to go when clicked
}

export interface FcmMessagePayload {
  notification?: FcmNotificationPayload;
  data?: Record<string, string>; // Extra data your app can use
}

export interface NotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  hasSentTokenToBackend: boolean;
}
```

---

## Data Flow Diagram

```
┌─────────────┐     Login      ┌─────────────────────┐
│   User      │ ─────────────→ │  auth.store.ts      │
│             │                │  (login action)     │
└─────────────┘                └─────────────────────┘
                                        │
                                        │ calls
                                        ▼
                               ┌─────────────────────┐
                               │ notificationService │
                               │ .initPushNotifs()   │
                               └─────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
           ┌─────────────┐    ┌─────────────────┐   ┌──────────────┐
           │  Firebase   │    │  Browser API    │   │  Backend     │
           │  Config     │    │  Notification   │   │  Server      │
           │             │    │  Permission     │   │              │
           └─────────────┘    └─────────────────┘   └──────────────┘
                  │                   │                   │
                  │                   │                   │
                  ▼                   ▼                   ▼
           ┌─────────────┐    ┌─────────────────┐   ┌──────────────┐
           │ getToken()  │←───│ "granted"?      │   │ POST /token  │
           │ returns FCM │    │ Yes → proceed   │   │ Save token   │
           │ token       │    │ No → wait       │   │ for user     │
           └─────────────┘    └─────────────────┘   └──────────────┘
                  │                                           │
                  │                                           │
                  ▼                                           ▼
           ┌─────────────────────────────────────────────────────┐
           │              LISTENING FOR MESSAGES                 │
           │                                                     │
           │  App Open (Foreground)                              │
           │  → onMessage() fires → toast.info()                 │
           │                                                     │
           │  App Closed (Background)                            │
           │  → Service Worker catches → showNotification()      │
           │                                                     │
           └─────────────────────────────────────────────────────┘
```

---

## Backend Requirements

Your backend needs these endpoints:

### 1. Save FCM Token
```
POST /api/fcm/token
Content-Type: application/json
Authorization: Bearer <user_token>

Body:
{
  "token": "fK1aB2cD3eF4...",
  "userId": "42",
  "deviceInfo": "Chrome on Windows"
}

Response: 200 OK
{ "message": "Token saved" }
```

**What backend should do:**
- Save the token in database linked to the user
- If same user has old tokens, mark them as inactive or delete them
- Use this token later to send FCM messages via Firebase Admin SDK

### 2. Delete FCM Token (on logout)
```
DELETE /api/fcm/token?token=fK1aB2cD3eF4...
Authorization: Bearer <user_token>

Response: 200 OK
{ "message": "Token deleted" }
```

**What backend should do:**
- Find token in database
- Delete it so server stops sending pushes to this device

### 3. Send Push Notification (example)
```javascript
// Using Firebase Admin SDK on backend
const admin = require('firebase-admin');

async function sendPushToUser(userId, title, body) {
  // Get user's FCM token from database
  const token = await db.tokens.findOne({ userId, active: true });

  await admin.messaging().send({
    token: token.value,
    notification: {
      title: title,
      body: body,
    },
    data: {
      click_action: '/dashboard',
      documentId: '12345'
    }
  });
}
```

---

## Environment Variables

Add these to your `.env` file:

```env
# Firebase Config (already exists, used by firebase.ts)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

# NEW: Push Notification Config
VITE_FIREBASE_VAPID_KEY=BFUxGl5lgDKrdGlsCNwKTpW3jjvTsy5I3up_XaBixFb3KB8ZVBTKbKNaBav80gZ-nZLGRyH365sgVFqr-ok4Ab4
VITE_FCM_TOKEN_ENDPOINT=/fcm/token
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_VAPID_KEY` | Optional | Your Firebase VAPID key. Falls back to hardcoded key if not set. |
| `VITE_FCM_TOKEN_ENDPOINT` | Optional | Backend endpoint for saving tokens. Defaults to `/fcm/token`. |

**How to get VAPID Key:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Cloud Messaging
3. Scroll to "Web Push certificates"
4. Click "Generate key pair"
5. Copy the "Key pair" value → that's your VAPID key

---

## How to Use in Components

### Example 1: Auto-init on Login (Already Done)
This is already set up in `auth.store.ts`. Nothing to do here.

### Example 2: Add "Enable Notifications" Button in Dashboard

```vue
<!-- src/components/dashboard/NotificationToggle.vue -->
<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>{{ isSubscribed ? 'mdi-bell' : 'mdi-bell-off' }}</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-if="!isSubscribed && canSubscribe">
        <v-list-item-title>
          <v-btn text @click="handleEnable">
            Enable Notifications
          </v-btn>
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-else-if="isSubscribed">
        <v-list-item-title class="text-success">
          Notifications Enabled ✅
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-else>
        <v-list-item-title class="text-error">
          Notifications Blocked ❌
        </v-list-item-title>
        <v-list-item-subtitle>
          Enable in browser settings
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';

const { isSubscribed, canSubscribe, enableNotifications } = useNotifications();

async function handleEnable() {
  const granted = await enableNotifications();
  if (granted) {
    alert('Notifications enabled! 🎉');
  } else {
    alert('Please allow notifications in browser settings.');
  }
}
</script>
```

### Example 3: Show Notification Badge

```vue
<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';

const { isSubscribed } = useNotifications();
</script>

<template>
  <v-badge
    :dot="isSubscribed"
    color="success"
  >
    <v-icon>mdi-bell</v-icon>
  </v-badge>
</template>
```

---

## Troubleshooting

### ❌ "Backend endpoint not found (404)"
**What it means:** Your backend doesn't have the `/fcm/token` endpoint yet.

**Fix:**
- This is a WARNING, not an error. The app works fine without it.
- Implement the backend endpoint (see [Backend Requirements](#backend-requirements)).

### ❌ "Push notifications are not supported in this browser"
**What it means:** The browser can't do push notifications.

**Common causes:**
- iOS Safari (not supported for web push)
- Private/Incognito mode
- Very old browser version

**Fix:** Use a supported browser (Chrome, Firefox, Edge).

### ❌ "Notification permission denied by user"
**What it means:** User clicked "Block" when asked for permission.

**Fix:**
- User must manually enable in browser settings:
  - Chrome: Click 🔒 in address bar → Site Settings → Notifications → Allow
- You cannot programmatically override this.

### ❌ Token not updating after reinstalling app
**What it means:** Firebase generates a new token, but localStorage still has the old one.

**Fix:** Already handled! The code compares `localStorage.getItem('fcm_token_value')` with the new token. If different, it sends the new one.

### ❌ Notifications show when app is open, but not when closed
**What it means:** Service Worker isn't registered properly.

**Fix:**
1. Check DevTools → Application → Service Workers
2. Make sure `firebase-messaging-sw.js` is registered
3. Check for errors in the Service Worker console

### ❌ Clicking notification doesn't open the app
**What it means:** The `notificationclick` event in the Service Worker has an issue.

**Fix:** Already implemented in `firebase-messaging-sw.js`. If not working:
- Check `click_action` in the push payload from backend
- Make sure the URL matches your app's origin

---

## Quick Reference

### For Backend Developers
```
POST /fcm/token     → Save token for user
DELETE /fcm/token   → Remove token on logout
```

### For Frontend Developers
```typescript
// In any component:
import { useNotifications } from '@/composables/useNotifications';
const { isSubscribed, enableNotifications } = useNotifications();

// Or call directly:
import notificationService from '@/services/notification.service';
await notificationService.enableNotifications();
```

### For DevOps
```env
VITE_FIREBASE_VAPID_KEY=your_key_here
VITE_FCM_TOKEN_ENDPOINT=/api/fcm/token
```

---

## Summary

| File | Role | You Edit This? |
|------|------|----------------|
| `firebase.ts` | Firebase connection | Only if changing Firebase project |
| `notification.service.ts` | Core logic | Rarely — it's complete |
| `firebase-messaging-sw.js` | Background notifications | Only for custom behavior |
| `auth.store.ts` | Auto-init on login | Already done |
| `App.vue` | Re-init on refresh | Already done |
| `useNotifications.ts` | Component helper | Already done |
| `notification.types.ts` | TypeScript types | Add more types if needed |

**The flow is fully automatic:**
1. User logs in → push notifications initialize
2. Token gets sent to backend (if endpoint exists)
3. Foreground messages → toast notifications
4. Background messages → native notifications
5. User logs out → token gets cleaned up

**All you need to do now:**
1. ✅ Implement `POST /fcm/token` and `DELETE /fcm/token` on your backend
2. ✅ Add `VITE_FIREBASE_VAPID_KEY` to your `.env`
3. ✅ Optionally add a "Enable Notifications" button using `useNotifications()`

