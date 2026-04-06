<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- Left: profile card -->
      <aside class="lg:col-span-3 space-y-5 sticky top-24">

        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 text-center">
          <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-stone-700 to-stone-900 flex items-center justify-center font-bold text-4xl text-stone-50 shadow-md mb-4 border-4 border-white ring-2 ring-stone-200">
            {{ profile.Username.charAt(0) }}
          </div>
          <h1 class="text-xl font-bold text-stone-900">{{ profile.Username }}</h1>
          <p class="text-sm text-stone-500 mt-0.5">{{ profile.Email }}</p>
          <p class="text-xs text-stone-400 mt-2">Member since {{ formatJoinDate(profile.JoinDate) }}</p>

          <button class="mt-5 w-full border border-stone-200 text-stone-600 text-sm font-medium py-2 rounded-xl hover:bg-stone-50 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profile
          </button>
        </div>

        <!-- Stats -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">Reading Stats</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-stone-600">Books Read</span>
              <span class="font-bold text-stone-900">{{ stats.booksRead }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-stone-600">Currently Reading</span>
              <span class="font-bold text-amber-700">{{ stats.booksReading }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-stone-600">Want to Read</span>
              <span class="font-bold text-stone-500">{{ stats.wantToRead }}</span>
            </div>
            <div class="h-px bg-stone-100 my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-stone-600">Reviews Written</span>
              <span class="font-bold text-stone-900">{{ stats.reviewsWritten }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-stone-600">Clubs Joined</span>
              <span class="font-bold text-stone-900">{{ stats.clubsJoined }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-stone-600">Threads Started</span>
              <span class="font-bold text-stone-900">{{ stats.threadsStarted }}</span>
            </div>
          </div>
        </div>

      </aside>

      <!-- Right: tabs content -->
      <div class="lg:col-span-9 space-y-6">

        <!-- Tabs -->
        <div class="flex gap-6 border-b border-stone-200">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="pb-3 text-sm font-semibold transition flex items-center gap-2"
            :class="activeTab === tab.key
              ? 'text-amber-700 border-b-2 border-amber-700'
              : 'text-stone-400 hover:text-stone-600'"
          >
            <component :is="'span'">{{ tab.label }}</component>
          </button>
        </div>

        <!-- Reading List tab -->
        <div v-if="activeTab === 'books'">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="book in books"
              :key="book.ISBN"
              class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4 flex gap-3 hover:shadow-md transition"
            >
              <div
                class="w-12 h-16 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-inner shrink-0"
                :class="genreColor(book.Genre)"
              >
                {{ book.Genre.substring(0, 3).toUpperCase() }}
              </div>
              <div class="flex flex-col justify-center min-w-0">
                <div class="font-semibold text-stone-900 text-sm leading-tight truncate">{{ book.Title }}</div>
                <div class="text-xs text-stone-500 mt-0.5 truncate">{{ book.Author }}</div>
                <div class="flex items-center gap-2 mt-2">
                  <span
                    class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border"
                    :class="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200': book.Status === 'Read',
                      'bg-amber-100 text-amber-800 border-amber-200': book.Status === 'Reading',
                      'bg-stone-100 text-stone-600 border-stone-200': book.Status === 'Want to Read',
                    }"
                  >{{ book.Status }}</span>
                  <div v-if="book.PersonalRating" class="flex text-amber-500">
                    <svg v-for="n in book.PersonalRating" :key="n" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews tab -->
        <div v-else-if="activeTab === 'reviews'">
          <div v-if="reviews.length === 0" class="text-center py-16 text-stone-400">
            <p class="font-medium">No reviews yet.</p>
            <RouterLink to="/compose" class="mt-2 inline-block text-amber-700 hover:underline text-sm">Write your first review →</RouterLink>
          </div>
          <div v-else class="space-y-4">
            <RouterLink
              v-for="review in reviews"
              :key="review.ThreadID"
              :to="{ name: 'thread', params: { id: review.ThreadID } }"
              class="block bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 hover:shadow-md transition group"
            >
              <div class="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span class="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-100">{{ review.ClubName }}</span>
                <span class="text-stone-300">&bull;</span>
                <span><em class="text-stone-700 font-medium">"{{ review.BookTitle }}"</em></span>
                <span class="ml-auto text-stone-400">{{ review.timeAgo }}</span>
              </div>
              <h3 class="font-bold text-stone-900 group-hover:text-amber-700 transition">{{ review.Topic }}</h3>
              <div class="flex text-amber-500 mt-2">
                <svg v-for="n in review.starRating" :key="n" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span class="ml-2 text-xs text-stone-400">{{ review.replyCount }} replies</span>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Clubs tab -->
        <div v-else-if="activeTab === 'clubs'">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="club in clubs"
              :key="club.ClubID"
              class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 hover:shadow-md transition"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center font-bold text-white shadow-sm">
                  {{ club.Name.charAt(0) }}
                </div>
                <span v-if="club.isModerator" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Mod</span>
              </div>
              <div class="font-bold text-stone-900 text-sm">{{ club.Name }}</div>
              <div class="text-xs text-stone-400 mt-1">{{ club.memberCount }} members · {{ club.type }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProfile, getProfileStats, getProfileBooks, getProfileReviews, getProfileClubs } from '../api/profile.js'

const loading = ref(true)
const profile = ref(null)
const stats = ref({})
const books = ref([])
const reviews = ref([])
const clubs = ref([])
const activeTab = ref('books')

const tabs = [
  { key: 'books', label: 'Reading List' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'clubs', label: 'Clubs' },
]

function formatJoinDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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
  const userID = 1 // hardcoded until auth is wired
  const [p, s, b, r, c] = await Promise.all([
    getProfile(userID),
    getProfileStats(userID),
    getProfileBooks(userID),
    getProfileReviews(userID),
    getProfileClubs(userID),
  ])
  profile.value = p
  stats.value = s
  books.value = b
  reviews.value = r
  clubs.value = c
  loading.value = false
})
</script>
