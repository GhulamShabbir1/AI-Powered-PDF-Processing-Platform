import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router'

import ForgetPassword from '../pages/auth/ForgetPassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import Home from '../pages/landing/Home.vue'

/* =========================
   ROUTES
========================= */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/auth/Register.vue')
  },
  {
    path: '/verify',
    name: 'Verify',
    component: () => import('../pages/auth/AccountVerify.vue')
  },

  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },

  /* =========================
     PROTECTED ROUTES
  ========================= */
  {
    path: '/test-upload',
    name: 'TestUpload',
    component: () => import('../pages/dashboard/ProcessDocument.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/process/:service',
    name: 'ProcessDocument',
    component: () => import('../pages/dashboard/ProcessDocument.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/dashboard/results/:fileId/:serviceType',
    name: 'RequestDetails',
    component: () => import('../pages/request/RequestDetails.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/Dashboard.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/dashboard/history',
    name: 'History',
    component: () => import('../pages/dashboard/Vault.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true
    }
  },

  /* =========================
     NOT FOUND
  ========================= */
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
]

/* =========================
   ROUTER
========================= */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/* =========================
   AUTH HELPERS (SAFE)
========================= */
function getToken(): string | null {
  try {
    const token = localStorage.getItem('token')
    return token ? token : null
  } catch {
    return null
  }
}

function isAuthenticated(): boolean {
  const token = getToken()
  return !!token && token.length > 10 // basic safety check
}

/* =========================
   GLOBAL GUARD
========================= */
router.beforeEach((to) => {
  const loggedIn = isAuthenticated()
  const requiresAuth = to.meta?.requiresAuth === true

  const publicPages = [
    'Home',
    'Login',
    'Register',
    'ForgetPassword',
    'ResetPassword',
    'Verify'
  ]

  /* -------------------------
     1. Protect private routes
  -------------------------- */
  if (requiresAuth && !loggedIn) {
    return {
      name: 'Login'
    }
  }

  /* -------------------------
     2. Prevent logged-in user
        from visiting auth pages
  -------------------------- */
  if (loggedIn && publicPages.includes(to.name as string)) {
    return { name: 'Dashboard' }
  }

  return true
})

export default router
