# TODO — Push Notification Implementation

## Overview
Implement: Login → Request Permission → Generate FCM Token → Send to Backend → Listen (foreground + background)

## Steps
- [x] 1. Gather repository info & understand existing code
- [x] 2. Improve Service Worker (`public/firebase-messaging-sw.js`) — add click handling, improve error safety
- [x] 3. Enhance Firebase Config (`src/config/firebase.ts`) — add `isMessagingSupported()` helper
- [x] 4. Rewrite Notification Service (`src/services/notification.service.ts`) — robust token handling, duplicate prevention, logout cleanup, browser support checks
- [x] 5. Update Auth Store (`src/stores/auth.store.ts`) — add logout cleanup + fire-and-forget init
- [x] 6. Update App.vue — add safety checks (try-catch)
- [x] 7. Create notification types (`src/types/notification.types.ts`)
- [x] 8. Create `useNotifications` composable (`src/composables/useNotifications.ts`)
- [x] 9. Verification & review

