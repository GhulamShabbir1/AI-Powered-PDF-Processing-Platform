import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ForgetPassword from '../pages/auth/ForgetPassword.vue'
import Home from '../pages/landing/Home.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'

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
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/Dashboard.vue'),
    meta: { layout: 'dashboard' }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
