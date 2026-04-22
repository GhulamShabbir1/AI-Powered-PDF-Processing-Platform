import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ForgetPassword from '../pages/auth/ForgetPassword.vue'
import Home from '../pages/landing/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    path: '/forget-password',
    name: 'ForgetPassword',
    component: ForgetPassword,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    components: {
      default: () => import('../pages/dashboard/Dashboard.vue'),
    },
    meta: { layout: 'default' }
  },
  {
    path: '/dashboard/ocr',
    name: 'Ocr',
    components: {
      default: () => import('../pages/dashboard/Ocr.vue'),
    },
    meta: { layout: 'default' }
  },
  {
    path: '/dashboard/summarizer',
    name: 'Summarizer',
    components: {
      default: () => import('../pages/dashboard/Summarizer.vue'),
    },
    meta: { layout: 'default' }
  },
  {
    path: '/dashboard/translator',
    name: 'Translator',
    components: {
      default: () => import('../pages/dashboard/Translator.vue'),
    },
    meta: { layout: 'default' }
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
