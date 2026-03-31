<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth.js'

const router = useRouter()
const sidebarOpen = ref(false)
const searchQuery = ref('')

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
        <form @submit.prevent="handleSearch" class="flex gap-2 max-w-lg">
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
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto px-6 pb-6">
        <slot />
      </main>
    </div>
  </div>
</template>
