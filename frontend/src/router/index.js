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

const routes = [
  { path: '/', name: 'feed', component: FeedView },
  { path: '/search', name: 'search', component: SearchView },
  { path: '/thread/:id', name: 'thread', component: ThreadView },
  { path: '/my-books', name: 'my-books', component: MyBooksView },
  { path: '/compose', name: 'compose', component: ComposeView },
  { path: '/communities', name: 'communities', component: CommunitiesView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/invitations', name: 'invitations', component: InvitationsView },
  { path: '/discover', name: 'discover', component: DiscoverView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
