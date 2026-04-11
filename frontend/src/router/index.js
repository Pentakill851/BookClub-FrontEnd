import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '../views/FeedView.vue'
import SearchView from '../views/SearchView.vue'
import ThreadView from '../views/ThreadView.vue'
import MyBooksView from '../views/MyBooksView.vue'
import ComposeView from '../views/ComposeView.vue'
import CommunitiesView from '../views/CommunitiesView.vue'
import ProfileView from '../views/ProfileView.vue'
import InvitationsView from '../views/InvitationsView.vue'
import DiscoverView from '../views/DiscoverView.vue'
import LoginView from '../views/LoginView.vue'
import ClubView from '../views/ClubView.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'feed', component: FeedView, meta: { requiresAuth: true } },
  { path: '/search', name: 'search', component: SearchView, meta: { requiresAuth: true } },
  { path: '/thread/:id', name: 'thread', component: ThreadView, meta: { requiresAuth: true } },
  { path: '/my-books', name: 'my-books', component: MyBooksView, meta: { requiresAuth: true } },
  { path: '/compose', name: 'compose', component: ComposeView, meta: { requiresAuth: true } },
  { path: '/communities', name: 'communities', component: CommunitiesView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/invitations', name: 'invitations', component: InvitationsView, meta: { requiresAuth: true } },
  { path: '/discover', name: 'discover', component: DiscoverView, meta: { requiresAuth: true } },
  { path: '/club/:id', name: 'club', component: ClubView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (res.ok) return true
  } catch {
    // network error — fall through to redirect
  }
  return { name: 'login' }
})

export default router
