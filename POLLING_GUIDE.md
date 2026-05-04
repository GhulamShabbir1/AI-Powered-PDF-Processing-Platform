# Polling in Your Application

## Overview

**Polling** is a technique where your app repeatedly asks the server for status updates at fixed intervals, without waiting for the server to push updates. Your app uses polling to track **document processing status** in real-time.

---

## Quick Summary

| Where | What | Interval | Purpose |
|-------|------|----------|---------|
| [src/pages/request/RequestDetails.vue](src/pages/request/RequestDetails.vue) | Poll request status | **4 seconds** | Track if PDF processing completed or failed |
| [src/pages/dashboard/ProcessDocument.vue](src/pages/dashboard/ProcessDocument.vue) | Service Worker updates | **60 minutes** | Check for new service worker versions |
| [src/composables/usePolling.ts](src/composables/usePolling.ts) | Reusable polling composable | Configurable | Generic polling utility (not directly used yet) |
| Notification Service | Token refresh | **24 hours** | Refresh FCM registration token |

---

## Where Polling is Used

### 1. **RequestDetails.vue** — Poll for document processing completion

**File**: [src/pages/request/RequestDetails.vue](src/pages/request/RequestDetails.vue)

**Why polling?**
- User uploads document for processing (PDF extraction, OCR, summarization, etc.)
- Backend processes asynchronously (takes 10–30 seconds)
- User must see **real-time status updates** (pending → processing → completed/failed)
- Polling repeatedly checks the status until the job completes

**How it works:**

```vue
<template>
  <!-- Shows loading spinner while polling -->
  <v-progress-linear v-if="isPolling" indeterminate color="primary" />
</template>

<script setup>
const pollingTimer = ref<number | null>(null)

// Get the current request status
const fetchRequest = async () => {
  try {
    const latest = await requestStore.fetchRequestById(fileId.value, serviceType.value)
    requestDetails.value = latest

    // STOP polling when job is done
    if (latest.status === 'completed' || latest.status === 'failed') {
      stopPolling()  // ← Important: avoid unnecessary API calls
    }
  } catch (error) {
    stopPolling()  // Stop if error
  }
}

// Start polling: call fetchRequest every 4 seconds
const startPolling = () => {
  stopPolling()  // Clear any existing timer first
  pollingTimer.value = window.setInterval(() => {
    void fetchRequest()
  }, 4000)  // ← 4-second interval
}

// Stop polling: clear the interval
const stopPolling = () => {
  if (pollingTimer.value) {
    window.clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}
</script>
```

**Status flow:**
```
┌─────────────────────────────────────────────┐
│ User navigates to RequestDetails page       │
│ (document being processed)                  │
└──────────────┬────────────────────────────┘
               │
               ↓
        startPolling()
        (every 4 seconds)
               │
               ↓
        fetchRequest()
        GET /api/requests/{id}
               │
        ┌──────┴──────┐
        ↓             ↓
    "pending"    "processing"
    (keep        (keep
     polling)     polling)
        │             │
        └──────┬──────┘
               │
               ↓
        ┌──────────────────┐
        ├─ "completed"     │
        ├─ "failed"        │
        └──────────────────┘
               │
               ↓
        stopPolling()
        (no more API calls)
```

**When polling starts:**
- Page load: `onMounted()` hook
- Manual refresh: User clicks "Refresh" button
- Visibility change: When user tabs back to the browser

**When polling stops:**
- Status becomes `completed` or `failed`
- User navigates away from the page
- Error occurs during fetch
- User manually stops (visibility change, unmount)

---

### 2. **ProcessDocument.vue** — Service Worker update check

**File**: [src/pages/dashboard/ProcessDocument.vue](src/pages/dashboard/ProcessDocument.vue)

**Why?**
- Ensures users get latest app updates without hard refresh
- Checks for new service worker versions periodically

**How it works:**
```ts
// In useServiceWorker.ts
updateIntervalId = setInterval(() => {
  registration?.update()  // Check for SW updates every 60 minutes
}, 60 * 60 * 1000)
```

---

### 3. **usePolling.ts** — Reusable polling composable

**File**: [src/composables/usePolling.ts](src/composables/usePolling.ts)

A generic composable you can reuse for any polling needs:

```ts
import { usePolling } from '@/composables/usePolling'

// In a component:
const { data, isPolling, error, start, stop } = usePolling(
  async () => await apiClient.get('/status'),  // Callback to call repeatedly
  {
    interval: 5000,          // Poll every 5 seconds
    immediate: true,         // Start polling immediately
    maxAttempts: 10,         // Stop after 10 failed attempts
  }
)

// Manually control:
start()   // Begin polling
stop()    // Stop polling
```

**Features:**
- ✅ Handles retries with backoff
- ✅ Automatic abort on unmount
- ✅ Configurable interval & max attempts
- ✅ Error tracking
- ✅ Data reactivity (Vue `ref`)

---

### 4. **Notification Service** — FCM token refresh

**File**: [src/services/notification.service.ts](src/services/notification.service.ts)

**Why?**
- FCM tokens expire after ~1 month of inactivity
- App needs to refresh and send new token to backend

**How it works:**
```ts
const TOKEN_REFRESH_INTERVAL = 24 * 60 * 60 * 1000  // 24 hours

private tokenRefreshTimer: ReturnType<typeof setInterval> | null = null

// Start token refresh polling
startTokenRefreshPolling() {
  this.tokenRefreshTimer = setInterval(async () => {
    await this.getAndSaveToken()  // Refresh token every 24 hours
  }, TOKEN_REFRESH_INTERVAL)
}
```

---

## Why Polling?

### Pros ✅
- **Simple**: Easy to implement (just `setInterval`)
- **Works everywhere**: No special browser APIs needed
- **Fallback**: Works when WebSockets unavailable
- **Predictable**: You know exactly when requests happen

### Cons ❌
- **Wasteful**: Makes requests even if no updates (4 requests/sec = 240 req/min)
- **Latency**: Can miss updates between poll intervals
- **Scalability**: Heavy load on backend if many users polling simultaneously

### When to use polling:
- ✅ Short jobs (10–30 seconds) — acceptable cost
- ✅ User expects fast updates (< 5 sec interval)
- ✅ Simple projects without WebSocket infrastructure
- ✅ Real-time feels like a "nice-to-have"

### When **not** to use polling:
- ❌ Long-running jobs (hours) — consider batch check-ins + push notifications
- ❌ High-frequency updates (100+ per second) — use WebSocket
- ❌ Millions of concurrent users — consider Server-Sent Events (SSE)

---

## Best Practices in Your Code

### ✅ **DO:**

1. **Stop polling when job completes**
   ```ts
   if (request.status === 'completed' || request.status === 'failed') {
     stopPolling()  // Prevents wasted requests
   }
   ```

2. **Clear timers on unmount**
   ```ts
   onBeforeUnmount(() => {
     stopPolling()  // Prevents memory leaks
   })
   ```

3. **Use reasonable intervals**
   - 4–5 seconds: Good for user-facing status (not too busy)
   - 60+ seconds: Good for background tasks
   - Avoid < 1 second: Too aggressive, strains backend

4. **Handle errors gracefully**
   ```ts
   try {
     const latest = await requestStore.fetchRequestById(...)
   } catch (error) {
     stopPolling()  // Stop on error
     showErrorNotification()
   }
   ```

### ❌ **DON'T:**

1. **Don't forget to stop polling**
   - Causes memory leaks
   - Wastes API quota
   - Increases server load

2. **Don't poll too frequently**
   - `setInterval(fetch, 100)` = 10 requests/sec = 36k requests/hour (bad!)

3. **Don't ignore race conditions**
   - Multiple rapid clicks → multiple intervals running simultaneously
   - **Solution:** Use `stopPolling()` before `startPolling()`

---

## Example: Refactoring to usePolling composable

Instead of manual timer management in RequestDetails.vue:

**Current (manual):**
```ts
const pollingTimer = ref<number | null>(null)

const startPolling = () => {
  stopPolling()
  pollingTimer.value = window.setInterval(() => {
    void fetchRequest()
  }, 4000)
}

const stopPolling = () => {
  if (pollingTimer.value) {
    window.clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}
```

**Better (with usePolling):**
```ts
import { usePolling } from '@/composables/usePolling'

const { data, isPolling, start, stop } = usePolling(
  async () => {
    const latest = await requestStore.fetchRequestById(fileId.value, serviceType.value)
    
    if (latest?.status === 'completed' || latest?.status === 'failed') {
      stop()  // Auto-stop when done
    }
    return latest
  },
  { interval: 4000, immediate: false }
)

const requestDetails = computed(() => data.value)

// Start/stop are exposed directly
```

**Benefits:**
- ✅ Cleaner, less boilerplate
- ✅ Automatic cleanup on unmount
- ✅ Error handling built-in
- ✅ Reusable across components

---

## Summary

| Component | What | Interval | Auto-stop? |
|-----------|------|----------|-----------|
| RequestDetails | Poll request status | 4s | ✅ Yes (on completed/failed) |
| ProcessDocument | SW update check | 60m | ✅ Yes (periodic) |
| usePolling | Generic utility | Configurable | ✅ Yes (on unmount) |
| Notifications | FCM token refresh | 24h | ✅ Yes (on logout) |

**Key takeaway:** Polling is useful for short-lived, user-initiated async jobs. Always:
- Stop when done
- Clean up on unmount
- Use reasonable intervals
- Handle errors

