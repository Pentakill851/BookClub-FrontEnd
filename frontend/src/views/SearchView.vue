<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- search bar at the top, centered looks cleaner -->
    <div class="max-w-2xl mx-auto mb-8">
      <h1 class="text-2xl font-bold text-stone-900 mb-1" style="font-family: Merriweather, serif;">The Archives</h1>
      <p class="text-sm text-stone-500 mb-6">Search books, discussions, and clubs.</p>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-stone-400 group-focus-within:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          v-model="query"
          @input="onSearch"
          class="block w-full pl-12 pr-4 py-3 border border-stone-200 rounded-2xl bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm shadow-sm transition-all"
          placeholder="Search by title, author, genre, topic..."
          autofocus
        >
      </div>

      <!-- toggle between books and threads -->
      <div class="flex gap-6 mt-6 border-b border-stone-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="pb-3 text-sm font-semibold transition"
          :class="activeTab === tab.key
            ? 'text-amber-700 border-b-2 border-amber-700'
            : 'text-stone-400 hover:text-stone-600'"
        >
          {{ tab.label }}
          <span class="ml-1.5 text-xs font-normal bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">
            {{ tab.key === 'books' ? bookResults.length : threadResults.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- spinning while results come back -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <!-- book results laid out as cards -->
    <div v-else-if="activeTab === 'books'">
      <div v-if="bookResults.length === 0" class="text-center py-16 text-stone-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        <p class="font-medium">No books found for "{{ query }}"</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[90rem] mx-auto">
        <div
          v-for="book in bookResults"
          :key="book.ISBN"
          class="bg-white rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3 cursor-pointer group"
        >
          <!-- fake cover using genre abbreviation -->
          <div
            class="w-full h-36 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-inner"
            :class="genreColor(book.Genre)"
          >
            {{ book.Genre.substring(0, 3).toUpperCase() }}
          </div>

          <div>
            <h3 class="font-bold text-stone-900 text-sm leading-tight group-hover:text-amber-700 transition">{{ book.Title }}</h3>
            <p class="text-xs text-stone-500 mt-0.5">{{ book.Author }}</p>
          </div>

          <div class="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
              :class="genreBadge(book.Genre)">
              {{ book.Genre }}
            </span>
            <span class="text-xs text-stone-400">{{ book.PublishedYear }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- thread results as a compact list -->
    <div v-else-if="activeTab === 'threads'">
      <div v-if="threadResults.length === 0" class="text-center py-16 text-stone-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        <p class="font-medium">No threads found for "{{ query }}"</p>
      </div>

      <div v-else class="max-w-3xl mx-auto space-y-4">
        <RouterLink
          v-for="thread in threadResults"
          :key="thread.ThreadID"
          :to="{ name: 'thread', params: { id: thread.ThreadID } }"
          class="block bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition group"
        >
          <div class="flex items-center gap-2 text-xs font-medium text-stone-500 mb-2">
            <span class="text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-100">{{ thread.ClubName }}</span>
            <span class="text-stone-300">&bull;</span>
            <span><em class="text-stone-700 font-medium">"{{ thread.BookTitle }}"</em></span>
            <span class="ml-auto text-stone-400">{{ thread.timeAgo }}</span>
          </div>
          <h3 class="font-bold text-stone-900 group-hover:text-amber-700 transition">{{ thread.Topic }}</h3>
          <div class="flex items-center gap-4 mt-3 text-xs text-stone-400">
            <span>by {{ thread.AuthorName }}</span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {{ thread.replyCount }} replies
            </span>
          </div>
        </RouterLink>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchBooks, searchThreads } from '../api/search.js'

const route = useRoute()
const query = ref(route.query.q || '')
const activeTab = ref('books')
const loading = ref(false)
const bookResults = ref([])
const threadResults = ref([])

const tabs = [
  { key: 'books', label: 'Books' },
  { key: 'threads', label: 'Threads' },
]

let debounceTimer = null
function onSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runSearch, 300)
}

async function runSearch() {
  loading.value = true
  const [books, threads] = await Promise.all([
    searchBooks(query.value),
    searchThreads(query.value),
  ])
  bookResults.value = books
  threadResults.value = threads
  loading.value = false
}

function genreColor(genre) {
  const map = {
    Dystopian: 'bg-slate-600',
    Classic: 'bg-stone-600',
    Fiction: 'bg-teal-600',
    Fantasy: 'bg-violet-600',
    Drama: 'bg-rose-600',
  }
  return map[genre] || 'bg-amber-700'
}

function genreBadge(genre) {
  const map = {
    Dystopian: 'bg-slate-50 text-slate-700 border-slate-200',
    Classic: 'bg-stone-50 text-stone-700 border-stone-200',
    Fiction: 'bg-teal-50 text-teal-700 border-teal-200',
    Fantasy: 'bg-violet-50 text-violet-700 border-violet-200',
    Drama: 'bg-rose-50 text-rose-700 border-rose-200',
  }
  return map[genre] || 'bg-amber-50 text-amber-700 border-amber-200'
}

watch(() => route.query.q, val => {
  if (val !== undefined) {
    query.value = val
    runSearch()
  }
})

onMounted(runSearch)
</script>
