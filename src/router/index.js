import { createRouter, createWebHistory } from 'vue-router'
import PayPage from '../views/PayPage.vue'

const routes = [
  {
    path: '/',
    name: 'pay',
    component: PayPage,
  },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
