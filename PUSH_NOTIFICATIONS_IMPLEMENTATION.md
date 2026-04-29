# 🚀 Professional Push Notification System — Implementation Guide

> Complete guide to the new professional push notification implementation for foreground & background message handling across all services and actions.

## 📋 Table of Contents

1. [What Was Fixed](#what-was-fixed)
2. [Architecture Overview](#architecture-overview)
3. [File Structure](#file-structure)
4. [Key Features](#key-features)
5. [How It Works](#how-it-works)
6. [Integration Points](#integration-points)
7. [Using in Components](#using-in-components)
8. [Event System](#event-system)
9. [Debugging & Logging](#debugging--logging)
10. [Troubleshooting](#troubleshooting)

---

## What Was Fixed

### ✅ Core Issues Resolved

| Issue | Solution |
|-------|----------|
| **No initialization flag** | Added `initialized` tracking to prevent re-initialization loops |
| **Service Worker errors** | Complete rewrite with error handling, logging, and rich features |
| **Missing retry logic** | Added exponential backoff retry for token operations |
| **Token never refreshes** | Auto-refresh on visibility change + 24-hour expiry check |
| **Not integrated with services** | Middleware added to all API calls; upload/request services enhanced |
| **No offline handling** | Online/offline detection with automatic retry |
| **Missing professional logging** | Comprehensive notification logger with debug mode |
| **No notification routing** | Service Worker click handling with client messaging |
| **No event system** | Full event emitter for lifecycle tracking |

### 🔧 What Was Added

1. **Enhanced Service Worker** (`public/firebase-messaging-sw.js`)
   - Error handling and recovery
   - Rich notification features (actions, images, grouping)
   - Click routing with client messaging
   - Comprehensive logging

2. **Notification Utilities** (`src/utils/notification-utils.ts`)
   - Professional logger with debug mode
   - Retry with exponential backoff
   - Token metadata management
   - Device detection
   - Online status detection
   - Notification deduplication
   - Service Worker health checks

3. **API Middleware** (`src/middleware/notification-middleware.ts`)
   - Automatic notifications for API calls
   - Request categorization (upload, download, processing, auth, sync)
   - Loading/success/error notifications
   - Configurable per-request

4. **Enhanced Notification Service** (`src/services/notification.service.ts`)
   - Initialization flag to prevent duplicates
   - Retry mechanisms with backoff
   - Event emitter system
   - Foreground message handling with deduplication
   - Visibility change listener
   - Online/offline listener
   - Token refresh logic
   - Proper cleanup on logout

5. **Service Worker Composable** (`src/composables/useServiceWorker.ts`)
   - Registration management
   - Update detection
   - Health ping
   - Automatic periodic updates

6. **Online Status Composable** (`src/composables/useOnlineStatus.ts`)
   - Real-time online/offline detection
   - Multiple listener support

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  User Action / App Event                                         │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  Service (Upload, Request, Auth, etc.)                           │
│  • Performs operation                                            │
│  • Uses clientNotificationService for UI feedback                │
│  • Uses notificationLogger for debugging                         │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  API Client (with Middleware)                                    │
│  • Request interceptor: shows loading toast                      │
│  • Response interceptor: shows success/error toast               │
│  • Automatic categorization & notifications                      │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  Backend API                                                     │
│  • Processes request                                             │
│  • Optionally sends push notification                            │
└─────────────────────────────────────────────────────────────────┘
                                ↓
                        TWO PATHS:
            ┌─────────────────────┴──────────────────┐
            ↓                                        ↓
     ┌─────────────┐                      ┌──────────────────┐
     │  FOREGROUND │                      │  BACKGROUND      │
     │  Message    │                      │  Message         │
     │  (App open) │                      │  (App closed)    │
     └──────┬──────┘                      └────────┬─────────┘
            ↓                                       ↓
     ┌─────────────────────┐              ┌──────────────────────┐
     │ onMessage handler   │              │ Service Worker       │
     │ in notification.ts  │              │ firebase-messaging   │
     │                     │              │                      │
     │ • Toast popup       │              │ • Browser            │
     │ • De-duplicate      │              │   notification       │
     │ • Emit event        │              │ • Click handling     │
     │                     │              │ • Routing            │
     └─────────────────────┘              └──────────────────────┘
```

---

## File Structure

```
src/
├── services/
│   ├── notification.service.ts          [ENHANCED] Main FCM service
│   ├── clientNotification.service.ts    [EXISTING] UI notifications
│   ├── upload.service.ts                [UPDATED] With logging
│   ├── request.service.ts               [UPDATED] With logging
│   └── apiClient.ts                     [UPDATED] Middleware installed
├── middleware/
│   └── notification-middleware.ts       [NEW] API auto-notifications
├── composables/
│   ├── useNotifications.ts              [EXISTING] State management
│   ├── useServiceWorker.ts              [NEW] SW management
│   └── useOnlineStatus.ts               [NEW] Online detection
├── utils/
│   └── notification-utils.ts            [NEW] Logger, helpers, tools
└── stores/
    └── auth.store.ts                    [UPDATED] Added cleanup()

public/
└── firebase-messaging-sw.js             [ENHANCED] Professional SW
```

---

## Key Features

### 1. **Automatic Service Worker Registration**
```typescript
import useServiceWorker from '@/composables/useServiceWorker'

const { isRegistered, ping, updateServiceWorker } = useServiceWorker()

// Automatically registered on mount
// Periodic updates checked every hour
// Ping available to check health
```

### 2. **Professional Logging**
```typescript
import { notificationLogger } from '@/utils/notification-utils'

// Enable debug mode
notificationLogger.enableDebug()

// Log messages
notificationLogger.info('User logged in')
notificationLogger.warn('Token expired')
notificationLogger.error('Network error')

// Get all logs (for bug reports)
const logs = notificationLogger.getLogs()
```

### 3. **Event-Based Notification System**
```typescript
import notificationService from '@/services/notification.service'

// Listen to lifecycle events
notificationService.on('init-success', () => {
  console.log('Notifications ready!')
})

notificationService.on('token-sent', (data) => {
  console.log('Token synced:', data.token)
})

notificationService.on('app-online', () => {
  console.log('App back online, retrying...')
})

notificationService.on('message-received-foreground', (payload) => {
  console.log('Got message:', payload)
})
```

### 4. **Online/Offline Detection**
```typescript
import useOnlineStatus from '@/composables/useOnlineStatus'

const { isOnline, isOffline, status } = useOnlineStatus()

// Use in template
<div v-if="isOffline" class="offline-banner">
  You are offline. Notifications will sync when online.
</div>
```

### 5. **API Auto-Notifications**
All API calls automatically get notifications based on their type:

| Type | Behavior |
|------|----------|
| **Upload** | Shows progress; completes with success/error |
| **Download** | Errors only |
| **Processing** | Errors only |
| **Auth** | Errors only |
| **Sync** | Errors only |
| **Other** | Errors only |

No code needed! Just call the API:
```typescript
// Upload automatically shows progress
const response = await apiClient.post('/file/upload', data)

// Custom notifications per-request
import { withNotificationConfig } from '@/middleware/notification-middleware'

await apiClient.get('/endpoint', 
  withNotificationConfig(
    {},
    { showSuccess: true, successMessage: 'Data loaded!' }
  )
)
```

### 6. **Token Management with Retry**
```typescript
import { retryWithBackoff } from '@/utils/notification-utils'

// Automatic retry with exponential backoff
const result = await retryWithBackoff(
  async () => {
    return await someOperation()
  },
  'Operation name',
  { maxRetries: 3, initialDelayMs: 1000 }
)
```

---

## How It Works

### On App Launch
```
1. Service Worker registered (useServiceWorker in App.vue)
2. Auth store checked for existing session
3. If authenticated:
   - notificationService.initPushNotifications() called
   - Browser support checked
   - Permission status checked
   - If permitted: FCM token retrieved
   - Token sent to backend via /fcm/token
   - Foreground listener attached
   - Visibility change listener attached
   - Online/offline listeners attached
4. Notification service emits 'init-success' event
```

### When Backend Sends Push Message

#### **Foreground (App Open)**
```
1. FCM delivers message
2. onMessage handler fires
3. Notification deduplication checked
4. Toast popup shown
5. 'message-received-foreground' event emitted
6. Auto-closes after 7 seconds
```

#### **Background (App Closed)**
```
1. Service Worker receives message
2. onBackgroundMessage handler fires
3. Browser notification shown
4. User clicks notification
5. App opens (if not running)
6. Client receives 'NOTIFICATION_CLICKED' message
7. Navigation to specified route happens
```

### On Logout
```
1. unregisterToken() called
   - Tries DELETE /fcm/token first
   - Falls back to POST /fcm/token/unregister
2. deleteToken() called
   - Token removed from Firebase
   - Local storage cleared
3. cleanup() called
   - All timers cleared
   - All listeners removed
   - Initialized flag reset
```

---

## Integration Points

### 1. **Upload Service Integration**
```typescript
// Already integrated - just use it!
import uploadService from '@/services/upload.service'

const result = await uploadService.uploadFile(file, (progress) => {
  console.log(`${progress.percentage}%`)
})

// Features:
// - Shows progress notification
// - Auto-updates progress
// - Shows completion
// - Shows errors
// - Logs everything
```

### 2. **Request Service Integration**
```typescript
// Already integrated - just use it!
import requestService from '@/services/request.service'

const request = await requestService.createRequest({
  fileId: '123',
  type: 'ocr',
})

// Features:
// - Shows processing notification
// - Shows errors
// - Logs everything
```

### 3. **Custom Service Integration**
```typescript
import { notificationLogger } from '@/utils/notification-utils'
import clientNotificationService from '@/services/clientNotification.service'

async function myCustomService() {
  try {
    notificationLogger.info('Starting custom operation')
    
    // Do work...
    
    await clientNotificationService.showSuccess(
      'Done!',
      'Operation completed'
    )
    
    notificationLogger.info('✅ Custom operation succeeded')
  } catch (error) {
    await clientNotificationService.showError(
      'Failed!',
      error.message
    )
    
    notificationLogger.error('Custom operation failed', { error: error.message })
  }
}
```

---

## Using in Components

### Example: Process Document Component

```vue
<template>
  <div>
    <button 
      @click="handleProcess"
      :disabled="isProcessing"
    >
      Process Document
    </button>
    
    <div v-if="isOffline" class="offline-warning">
      You are offline. Processing will sync when back online.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import requestService from '@/services/request.service'
import useOnlineStatus from '@/composables/useOnlineStatus'
import { notificationLogger } from '@/utils/notification-utils'

const isProcessing = ref(false)
const { isOffline } = useOnlineStatus()

async function handleProcess() {
  isProcessing.value = true
  try {
    notificationLogger.info('User initiated document processing')
    
    const request = await requestService.createRequest({
      fileId: '123',
      type: 'ocr',
    })
    
    notificationLogger.info('Document processing started', {
      requestId: request.id,
      status: request.status,
    })
  } finally {
    isProcessing.value = false
  }
}
</script>
```

---

## Event System

### Available Events

| Event | Data | Fired When |
|-------|------|-----------|
| `init-success` | `{}` | Initialization completes successfully |
| `init-failed` | `{ reason: string }` | Initialization fails |
| `token-sent` | `{ token: string }` | Token sent to backend |
| `token-backend-failed` | `{ status, endpoint, message }` | Token send fails |
| `token-unregistered` | `{ method: 'DELETE' \| 'POST' }` | Token unregistered on logout |
| `token-cleared` | `{}` | Token cleared from local storage |
| `permission-changed` | `{ permission: NotificationPermission }` | User changes permission |
| `app-foreground` | `{}` | App brought to foreground |
| `app-background` | `{}` | App sent to background |
| `app-online` | `{}` | Network came back online |
| `app-offline` | `{}` | Network went offline |
| `message-received-foreground` | `FcmMessagePayload` | FCM message received while app open |
| `notifications-enabled` | `{}` | User enabled notifications |
| `cleanup-complete` | `{}` | Service cleaned up on logout |

### Usage Example

```typescript
import notificationService from '@/services/notification.service'

// Single listener
const unsubscribe = notificationService.on('token-sent', (data) => {
  console.log('Token synced!')
})

// Later: stop listening
unsubscribe()

// Multiple listeners
notificationService.on('app-online', () => syncData())
notificationService.on('app-offline', () => disableSync())
```

---

## Debugging & Logging

### Enable Debug Mode

```typescript
import { notificationLogger } from '@/utils/notification-utils'

// In browser console:
notificationLogger.enableDebug()

// Now all debug logs are printed
// Disable with:
notificationLogger.disableDebug()
```

### View All Logs

```typescript
// In browser console:
const logs = notificationLogger.getLogs()
console.table(logs)

// Send to server for analysis
const response = await fetch('/api/logs', {
  method: 'POST',
  body: JSON.stringify({ logs }),
})
```

### Check Service Worker Status

```typescript
import { checkServiceWorkerHealth } from '@/utils/notification-utils'

const health = await checkServiceWorkerHealth()
console.log(health)
// {
//   registered: true,
//   active: true,
//   controllingClient: true,
//   error: null
// }
```

### Ping Service Worker

```typescript
import useServiceWorker from '@/composables/useServiceWorker'

const { ping } = useServiceWorker()

const isAlive = await ping()
console.log('Service Worker alive:', isAlive)
```

---

## Troubleshooting

### Push Notifications Not Working

#### Step 1: Check Browser Support
```typescript
import { hasNotificationSupport } from '@/utils/notification-utils'

if (!hasNotificationSupport()) {
  console.log('Notifications not supported (Safari private mode?)')
}
```

#### Step 2: Check Permission
```typescript
import { getNotificationPermission } from '@/utils/notification-utils'

const permission = getNotificationPermission()
// 'granted' | 'denied' | 'default'
```

#### Step 3: Check Service Worker
```typescript
import { checkServiceWorkerHealth } from '@/utils/notification-utils'

const health = await checkServiceWorkerHealth()
console.log(health)
```

#### Step 4: Check Logs
```typescript
import { notificationLogger } from '@/utils/notification-utils'

notificationLogger.enableDebug()
// Reload page and check console
```

### Notifications Not Showing

1. **Foreground notifications** - Check if toast service is available
   - Ensure Vue Toastification is installed and initialized
   - Check browser console for errors

2. **Background notifications** - Check Service Worker
   - Open DevTools → Application → Service Workers
   - Check if registered and active
   - Check Firebase config in Service Worker

3. **Backend token endpoint** - Check backend implementation
   - Endpoint should be `POST /fcm/token`
   - Should accept `{ token, userId?, deviceInfo? }`
   - Should respond with 2xx status

### Duplicate Notifications

Handled automatically by notification deduplicator. If still seeing duplicates:

1. Check notification tag uniqueness in backend
2. Check if same message sent multiple times
3. Enable debug logging to see dedup events

### Token Not Sending to Backend

1. Check if FCM token is being generated
   - Permission should be 'granted'
   - Browser should support Notifications

2. Check backend endpoint
   ```bash
   curl -X POST http://localhost:8085/api/fcm/token \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"token":"test","userId":"123"}'
   ```

3. Check authentication
   - Token should be included in Authorization header
   - Backend should accept it

4. Check logs
   ```typescript
   notificationLogger.enableDebug()
   // Reload and trigger init
   const logs = notificationLogger.getLogs()
   console.table(logs)
   ```

---

## Backend Requirements

Your backend must implement:

### `POST /fcm/token` - Register device token
```json
Request:
{
  "token": "fcm-token-from-firebase",
  "userId": "user-id",
  "deviceInfo": "Chrome on Windows"
}

Response:
{
  "success": true,
  "message": "Token registered"
}
```

### `DELETE /fcm/token` or `POST /fcm/token/unregister` - Unregister on logout
```
Query: ?token=TOKEN
or
Body: { "token": "TOKEN" }

Response: 200 OK
```

### Backend to Client: Send Push Notifications
```javascript
// Use Firebase Admin SDK to send

const message = {
  notification: {
    title: 'Document Ready',
    body: 'Your PDF is ready to download',
    icon: '/icon.png',
    image: '/preview.png',
  },
  data: {
    click_action: '/dashboard/documents/123',
    document_id: '123',
  },
  webpush: {
    fcmOptions: {
      link: 'https://yourapp.com/dashboard',
    },
  },
};

const tokens = [/* FCM tokens from your DB */];
await admin.messaging().sendMulticast({
  tokens,
  notification: message.notification,
  webpush: message.webpush,
});
```

---

## Summary

✅ **Complete professional push notification system**
- ✅ Foreground message handling with toast
- ✅ Background message handling with Service Worker
- ✅ Click routing and navigation
- ✅ Token management with retry
- ✅ Online/offline detection
- ✅ Professional logging
- ✅ Event system
- ✅ API middleware integration
- ✅ Service integration (upload, request)
- ✅ Proper cleanup on logout
- ✅ Full documentation

**Ready for production use!**
