import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/landing/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    // Add other routes as needed
  ],
})

export default router
