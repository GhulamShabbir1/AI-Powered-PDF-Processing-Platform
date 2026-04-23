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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/Dashboard.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true
    }
  },

  {
    path: '/dashboard/vault',
    name: 'Vault',
    component: () => import('../pages/dashboard/Vault.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true
    }
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
   AUTH HELPERS
========================= */
function isAuthenticated() {
  return !!localStorage.getItem('token')
}

/* =========================
   ROUTE GUARD
========================= */
router.beforeEach((to, _from, next) => {
  const publicPages = [
    'Home',
    'Login',
    'Register',
    'ForgetPassword',
    'ResetPassword',
    'Verify'
  ]

  const requiresAuth = to.meta?.requiresAuth === true
  const loggedIn = isAuthenticated()

  /* 🔐 Case 1: Protected route */
  if (requiresAuth && !loggedIn) {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }

  /* 🔁 Case 2: Logged-in user accessing auth pages */
  if (loggedIn && publicPages.includes(to.name as string)) {
    return next({ name: 'Dashboard' })
  }

  /* ✅ Case 3: Allow navigation */
  return next()
})

export default router
