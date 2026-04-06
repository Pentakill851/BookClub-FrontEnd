<template>
  <div class="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-amber-100 selection:text-amber-900 flex flex-col">

    <nav class="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
      <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center gap-8">

        <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900 shrink-0">
          <div class="bg-amber-700 text-white p-1.5 rounded-lg shadow-sm border border-amber-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          BookClubDB
        </RouterLink>

        <div class="flex-1 max-w-2xl hidden md:block">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-stone-400 group-focus-within:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="goToSearch"
              class="block w-full pl-11 pr-4 py-2 border border-stone-200 rounded-full leading-5 bg-stone-50 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 sm:text-sm transition-all"
              placeholder="Search the archives..."
            >
          </div>
        </div>

        <div class="flex items-center gap-6 shrink-0">
          <RouterLink to="/search" class="text-sm font-medium text-stone-500 hover:text-stone-900 hidden lg:block transition">Discover</RouterLink>
          <RouterLink to="/communities" class="text-sm font-medium text-stone-500 hover:text-stone-900 hidden lg:block transition">Communities</RouterLink>
          <RouterLink to="/my-books" class="text-sm font-medium text-stone-500 hover:text-stone-900 hidden lg:block transition">My Books</RouterLink>

          <div class="relative cursor-pointer hover:text-amber-700 transition text-stone-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white"></span>
          </div>

          <RouterLink to="/profile" class="flex items-center gap-2 pl-5 border-l border-stone-200 group">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-700 to-stone-900 flex items-center justify-center font-bold text-stone-50 shadow-sm ring-2 ring-transparent group-hover:ring-amber-200 transition">
              A
            </div>
            <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </RouterLink>
        </div>

      </div>
    </nav>

    <RouterView />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

function goToSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}
</script>
