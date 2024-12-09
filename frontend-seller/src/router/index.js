import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('../views/EntryView.vue'),
    },
    {
      path: '/create-product',
      name: 'create-product',
      component: () => import('../views/CreateProduct.vue'),
    },
    {
      path: '/product-list',
      name: 'product-list',
      component: () => import('../views/ProductList.vue'),
    },
    {
      path: '/product-list/edit-product/:id',
      name: 'edit-product',
      component: () => import('../views/EditProduct.vue'),
    },

    {
      path: '/product-books',
      name: 'product-books',
      component: () => import('../views/ProductBooks.vue'),
    },
  ],
})

export default router
