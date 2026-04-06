<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- library title and shortcut to add books -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-stone-900" style="font-family: Merriweather, serif;">My Library</h1>
        <p class="text-sm text-stone-500 mt-1">Track your reading journey.</p>
      </div>
      <RouterLink
        to="/search"
        class="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Add Book
      </RouterLink>
    </div>

    <!-- spinner while books fetch -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <div v-else>

      <!-- quick reading counts at a glance -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 text-center">
          <div class="text-2xl font-bold text-stone-900">{{ books.length }}</div>
          <div class="text-xs text-stone-500 mt-1 uppercase tracking-wider font-medium">Total Books</div>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 text-center">
          <div class="text-2xl font-bold text-emerald-700">{{ countByStatus('Read') }}</div>
          <div class="text-xs text-stone-500 mt-1 uppercase tracking-wider font-medium">Read</div>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 text-center">
          <div class="text-2xl font-bold text-amber-700">{{ countByStatus('Reading') }}</div>
          <div class="text-xs text-stone-500 mt-1 uppercase tracking-wider font-medium">Reading</div>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 text-center">
          <div class="text-2xl font-bold text-stone-500">{{ countByStatus('Want to Read') }}</div>
          <div class="text-xs text-stone-500 mt-1 uppercase tracking-wider font-medium">Want to Read</div>
        </div>
      </div>

      <!-- filter down by reading status -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button
          v-for="f in filters"
          :key="f"
          @click="activeFilter = f"
          class="px-4 py-2 rounded-full text-sm font-medium transition border"
          :class="activeFilter === f
            ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
            : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:text-amber-800'"
        >
          {{ f }}
          <span class="ml-1.5 text-xs opacity-70">({{ f === 'All' ? books.length : countByStatus(f) }})</span>
        </button>
      </div>

      <!-- nothing to show for this filter -->
      <div v-if="filteredBooks.length === 0" class="text-center py-20 text-stone-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        <p class="font-medium">No books in this list yet.</p>
        <RouterLink to="/search" class="mt-2 inline-block text-amber-700 hover:underline text-sm">Search the archives to add some →</RouterLink>
      </div>

      <!-- the actual books laid out as cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="book in filteredBooks"
          :key="book.ISBN"
          class="bg-white rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden group"
        >
          <!-- colored block pretending to be a book cover -->
          <div
            class="h-36 flex items-center justify-center text-2xl font-bold text-white"
            :class="genreColor(book.Genre)"
          >
            {{ (book.Genre || 'Book').substring(0, 3).toUpperCase() }}
          </div>

          <div class="p-4 flex flex-col flex-1">
            <h3 class="font-bold text-stone-900 text-sm leading-tight group-hover:text-amber-700 transition">{{ book.Title }}</h3>
            <p class="text-xs text-stone-500 mt-0.5 mb-3">{{ book.Author }} · {{ book.PublishedYear }}</p>

            <!-- dropdown to update reading status -->
            <div class="mt-auto space-y-3">
              <select
                :value="book.Status"
                @change="changeStatus(book, $event.target.value)"
                class="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 cursor-pointer"
                :class="{
                  'text-emerald-700': book.Status === 'Read',
                  'text-amber-800': book.Status === 'Reading',
                  'text-stone-600': book.Status === 'Want to Read',
                }"
              >
                <option value="Read">Read</option>
                <option value="Reading">Reading</option>
                <option value="Want to Read">Want to Read</option>
              </select>

              <!-- clickable stars for personal rating -->
              <div class="flex items-center gap-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="changeRating(book, star)"
                  class="transition"
                  :class="star <= (book.PersonalRating || 0) ? 'text-amber-500' : 'text-stone-200 hover:text-amber-300'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </button>
                <span v-if="book.PersonalRating" class="text-xs text-stone-400 ml-1">{{ book.PersonalRating }}/5</span>
                <span v-else class="text-xs text-stone-300 ml-1">Not rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMyBooks, updateBookStatus, rateBook } from '../api/books.js'

const loading = ref(true)
const books = ref([])
const activeFilter = ref('All')

const filters = ['All', 'Read', 'Reading', 'Want to Read']

const filteredBooks = computed(() => {
  if (activeFilter.value === 'All') return books.value
  return books.value.filter(b => b.Status === activeFilter.value)
})

function countByStatus(status) {
  return books.value.filter(b => b.Status === status).length
}

async function changeStatus(book, newStatus) {
  book.Status = newStatus
  await updateBookStatus(book.ISBN, newStatus)
}

async function changeRating(book, rating) {
  const newRating = book.PersonalRating === rating ? null : rating
  book.PersonalRating = newRating
  await rateBook(book.ISBN, newRating)
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

onMounted(async () => {
  try {
    books.value = await getMyBooks()
  } catch {
    books.value = []
  } finally {
    loading.value = false
  }
})
</script>
