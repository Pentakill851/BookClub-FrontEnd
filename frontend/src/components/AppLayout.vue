<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth.js'
import { getInvitationCount } from '@/api/invitations.js'

const router = useRouter()
const sidebarOpen = ref(false)
const searchQuery = ref('')
const pendingInviteCount = ref(0)

async function refreshInviteCount() {
  try {
    const result = await getInvitationCount()
    pendingInviteCount.value = result.count
  } catch {
    pendingInviteCount.value = 0
  }
}

provide('refreshInviteCount', refreshInviteCount)

onMounted(refreshInviteCount)

async function handleLogout() {
  await logout()
  router.push('/login')
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

function handleSearch() {
  const q = searchQuery.value.trim()
  if (q) {
    router.push('/search?q=' + encodeURIComponent(q))
    searchQuery.value = ''
  }
}

const navLinks = [
  { label: 'Feed',           to: '/' },
  { label: 'My Books',       to: '/my-books' },
  { label: 'Invitations',    to: '/invitations' },
  { label: 'My Communities', to: '/communities' },
  { label: 'Discover',       to: '/discover' },
  { label: 'Profile',        to: '/profile' },
]
</script>

<template>
  <div class="min-h-screen flex bg-stone-100">

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/40 md:hidden"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-56 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200',
        'md:static md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="px-5 py-5 border-b border-stone-100">
        <span class="text-xl font-bold text-stone-800 font-serif">BookClubDB</span>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="closeSidebar"
          class="flex items-center px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          active-class="bg-amber-50 text-amber-700 font-medium"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="px-3 py-4 border-t border-stone-100">
        <button
          @click="handleLogout"
          class="w-full flex items-center px-3 py-2 rounded-lg text-sm text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- Main content column -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Mobile top bar -->
      <header class="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200">
        <button
          @click="toggleSidebar"
          class="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100"
          aria-label="Open menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-lg font-bold text-stone-800 font-serif">BookClubDB</span>
      </header>

      <!-- Top search bar -->
      <div class="px-6 pt-5 pb-2">
        <div class="flex items-center gap-3 max-w-lg">
          <form @submit.prevent="handleSearch" class="flex gap-2 flex-1">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search books, clubs, threads…"
              class="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              type="submit"
              class="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
          <!-- Notification bell -->
          <router-link to="/invitations" class="relative p-2 rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors" aria-label="Invitations">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span
              v-if="pendingInviteCount > 0"
              class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"
            />
          </router-link>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto px-6 pb-6">
        <slot />
      </main>
    </div>
  </div>
</template>
