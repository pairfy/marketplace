import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/us',
    },
    {
      path: '/:country',
      name: 'home',
      component: HomeView,
      props: true,
    },
    {
      path: '/:country/product/:id',
      name: 'product',
      component: () => import('../views/product/ProductView.vue'),
      props: true,
    },
    {
      path: '/:country/search',
      name: 'search',
      component: () => import('../views/search/SearchView.vue'),
      props: true,
    },
    {
      path: '/:country/order/:id',
      name: 'order',
      component: () => import('../views/order/OrderView.vue'),
      props: true,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Restore scroll position when navigating back
    } else {
      return { top: 0, left: 0 }; // Scroll to top with smooth effect
    }
  },
})

export default router
