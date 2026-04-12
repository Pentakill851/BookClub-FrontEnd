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
          @click="openBookPanel(book)"
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
            <span class="text-xs text-stone-400 group-hover:text-amber-600 transition">{{ book.PublishedYear }}</span>
          </div>
          <div class="text-[10px] text-stone-400 group-hover:text-amber-600 transition text-center">Click for details →</div>
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

  <!-- Book detail panel backdrop -->
  <Transition name="fade">
    <div
      v-if="selectedBook"
      class="fixed inset-0 bg-black/40 z-40"
      @click="closePanel"
    ></div>
  </Transition>

  <!-- Book detail slide-over panel -->
  <Transition name="slide">
    <div
      v-if="selectedBook"
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl overflow-hidden"
    >
      <!-- Panel header: colored genre banner -->
      <div class="relative flex items-end px-6 pb-5 pt-12 text-white" :class="genreColor(selectedBook.Genre)">
        <button
          @click="closePanel"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div>
          <div class="text-[11px] uppercase tracking-widest font-bold opacity-80 mb-1">{{ selectedBook.Genre }}</div>
          <h2 class="text-xl font-bold leading-tight" style="font-family: Merriweather, serif;">{{ selectedBook.Title }}</h2>
          <p class="text-sm opacity-90 mt-1">{{ selectedBook.Author }}</p>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">

        <!-- Book metadata -->
        <div class="px-6 py-5 border-b border-stone-100">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-stone-50 rounded-xl p-3">
              <div class="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-0.5">Published</div>
              <div class="text-sm font-semibold text-stone-800">{{ selectedBook.PublishedYear }}</div>
            </div>
            <div class="bg-stone-50 rounded-xl p-3">
              <div class="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-0.5">Genre</div>
              <div class="text-sm font-semibold text-stone-800">{{ selectedBook.Genre }}</div>
            </div>
            <div class="bg-stone-50 rounded-xl p-3 col-span-2">
              <div class="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-0.5">ISBN</div>
              <div class="text-sm font-mono text-stone-600">{{ selectedBook.ISBN }}</div>
            </div>
          </div>
        </div>

        <!-- Add to My Books -->
        <div class="px-6 py-5 border-b border-stone-100">
          <h3 class="text-sm font-bold text-stone-800 mb-3">Add to My Books</h3>

          <div v-if="addSuccess" class="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            Added to your books as <strong class="ml-1">{{ addStatus }}</strong>
          </div>
          <div v-if="addError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">{{ addError }}</div>

          <div class="flex gap-2">
            <select
              v-model="addStatus"
              class="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option>Want to Read</option>
              <option>Reading</option>
              <option>Read</option>
            </select>
            <button
              @click="handleAddBook"
              :disabled="addingBook"
              class="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2"
            >
              <span v-if="addingBook" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
          </div>
        </div>

        <!-- Related threads -->
        <div class="px-6 py-5">
          <h3 class="text-sm font-bold text-stone-800 mb-3">Discussions</h3>

          <div v-if="panelThreadsLoading" class="flex justify-center py-8">
            <div class="w-6 h-6 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
          </div>

          <div v-else-if="panelThreads.length === 0" class="text-center py-8 text-stone-400">
            <svg class="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p class="text-sm">No discussions yet for this book.</p>
          </div>

          <div v-else class="space-y-3">
            <RouterLink
              v-for="thread in panelThreads"
              :key="thread.ThreadID"
              :to="{ name: 'thread', params: { id: thread.ThreadID } }"
              class="block bg-stone-50 hover:bg-amber-50 border border-stone-200/60 hover:border-amber-200 rounded-xl p-4 transition group"
              @click="closePanel"
            >
              <div class="flex items-center gap-2 text-[11px] text-stone-400 mb-1.5">
                <span class="text-amber-700 font-semibold">{{ thread.ClubName }}</span>
                <span class="ml-auto">{{ thread.timeAgo }}</span>
              </div>
              <p class="text-sm font-semibold text-stone-800 group-hover:text-amber-700 transition leading-snug">{{ thread.Topic }}</p>
              <div class="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
                <span>by {{ thread.AuthorName }}</span>
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  {{ thread.replyCount }} replies
                </span>
              </div>
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchBooks, searchThreads } from '../api/search.js'
import { addBook } from '../api/books.js'

const route = useRoute()
const query = ref(route.query.q || '')
const activeTab = ref('books')
const loading = ref(false)
const bookResults = ref([])
const threadResults = ref([])

// Book detail panel state
const selectedBook = ref(null)
const panelThreads = ref([])
const panelThreadsLoading = ref(false)
const addStatus = ref('Want to Read')
const addingBook = ref(false)
const addSuccess = ref(false)
const addError = ref(null)

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

async function openBookPanel(book) {
  selectedBook.value = book
  panelThreads.value = []
  addSuccess.value = false
  addError.value = null
  addStatus.value = 'Want to Read'

  panelThreadsLoading.value = true
  panelThreads.value = await searchThreads(book.Title)
  panelThreadsLoading.value = false
}

function closePanel() {
  selectedBook.value = null
}

async function handleAddBook() {
  if (!selectedBook.value) return
  addingBook.value = true
  addSuccess.value = false
  addError.value = null
  try {
    await addBook(selectedBook.value.ISBN, addStatus.value)
    addSuccess.value = true
  } catch (err) {
    addError.value = err.message
  } finally {
    addingBook.value = false
  }
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
