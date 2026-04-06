<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-stone-900" style="font-family: Merriweather, serif;">Discover</h1>
        <p class="text-sm text-stone-500 mt-1">Books popular across clubs, sorted by readers.</p>
      </div>

      <div class="flex gap-2">
        <button
          v-for="g in ['All', ...genres]"
          :key="g"
          @click="activeGenre = g"
          class="px-3 py-1.5 rounded-full text-xs font-semibold border transition"
          :class="activeGenre === g
            ? 'bg-amber-700 text-white border-amber-700'
            : 'bg-white text-stone-500 border-stone-200 hover:border-amber-300 hover:text-amber-800'"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div
        v-for="book in filtered"
        :key="book.ISBN"
        class="bg-white rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {{ book.Title.charAt(0) }}
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
            {{ book.Genre }}
          </span>
        </div>

        <div class="flex-1">
          <h3 class="font-bold text-stone-900 leading-snug">{{ book.Title }}</h3>
          <p class="text-xs text-stone-500 mt-0.5">{{ book.Author }}</p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-400">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {{ book.readerCount }} readers
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            {{ book.avgRating.toFixed(1) }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {{ book.clubCount }} {{ book.clubCount === 1 ? 'club' : 'clubs' }}
          </span>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDiscoverBooks } from '../api/discover.js'

const loading = ref(true)
const books = ref([])
const activeGenre = ref('All')

const genres = computed(() => [...new Set(books.value.map(b => b.Genre))])

const filtered = computed(() =>
  activeGenre.value === 'All' ? books.value : books.value.filter(b => b.Genre === activeGenre.value)
)

onMounted(async () => {
  books.value = await getDiscoverBooks()
  loading.value = false
})
</script>
