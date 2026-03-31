import { createRouter, createWebHistory } from 'vue-router'
import { getMe } from '@/api/auth.js'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    component: () => import('@/views/FeedView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    component: () => import('@/views/SearchView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/compose',
    component: () => import('@/views/ComposeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id',
    component: () => import('@/views/ThreadView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-books',
    component: () => import('@/views/MyBooksView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invitations',
    component: () => import('@/views/InvitationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/communities',
    component: () => import('@/views/CommunitiesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/discover',
    component: () => import('@/views/DiscoverView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const result = await getMe()
    if (!result.data) {
      return next('/login')
    }
  }
  next()
})

export default router
