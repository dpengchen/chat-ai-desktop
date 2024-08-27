import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TYService from '@/views/chats/TYService.vue'
import DeepService from '@/views/chats/DeepService.vue'
import KimiService from '@/views/chats/KimiService.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [{
      path: 'deep',
      default: true,
      name: 'deepSeek',
      component: DeepService
    }, {
      path: 'ty',
      name: '通义千问',
      component: TYService
    }, {
      path: 'kimi',
      name: 'Kimi',
      component: KimiService
    }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
