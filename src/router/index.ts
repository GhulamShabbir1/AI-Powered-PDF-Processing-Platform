import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/landing/Home.vue'
import ForgetPassword from '../pages/auth/ForgetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword,
    },
    // Add other routes as needed
  ],
})

export default router
