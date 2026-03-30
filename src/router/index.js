import { createRouter, createWebHistory } from 'vue-router'
import PayHome from '@/views/pay/PayHome.vue'
import PayResult from '@/views/pay/PayResult.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PayHome
    },
    {
      path: '/pay/result',
      component: PayResult
    }
  ]
})

export default router
