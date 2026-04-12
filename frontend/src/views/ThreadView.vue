<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- let them get back to the feed -->
    <RouterLink to="/" class="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 transition mb-6">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      Back to Feed
    </RouterLink>

    <!-- waiting on thread and messages to load -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
      <div class="text-stone-500 text-sm">Loading thread...</div>
    </div>

    <!-- thread doesn't exist, handle gracefully -->
    <div v-else-if="!thread" class="text-center py-24 text-stone-400">
      <p class="text-lg font-medium">Thread not found.</p>
      <RouterLink to="/" class="mt-4 inline-block text-amber-700 hover:underline text-sm">Return to feed</RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- thread and replies take most of the page -->
      <div class="lg:col-span-8 space-y-6">

        <!-- the original post at the top -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
          <div class="flex justify-between items-start mb-5">
            <div class="flex items-center gap-2 text-xs font-medium text-stone-500">
              <RouterLink :to="{ name: 'club', params: { id: thread.ClubID } }" class="text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-100 hover:bg-amber-100 transition">{{ thread.ClubName }}</RouterLink>
              <span class="text-stone-300">&bull;</span>
              <span>Discussing: <em class="text-stone-700 font-medium">"{{ thread.BookTitle }}"</em></span>
            </div>
            <!-- only show delete if it's your own thread -->
            <button
              v-if="thread.AuthorID === currentUserID"
              @click="confirmDelete"
              class="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete Thread
            </button>
          </div>

          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-600 shrink-0 shadow-inner">
              {{ thread.AuthorName.charAt(0) }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <span class="font-bold text-stone-900">{{ thread.AuthorName }}</span>
                <span class="text-xs text-stone-400">{{ formatDate(thread.CreatedAt) }}</span>
              </div>
              <h1 class="text-xl font-bold text-stone-900 mb-2 leading-tight" style="font-family: Merriweather, serif;">{{ thread.Topic }}</h1>
              <div v-if="thread.isReview" class="flex text-amber-500 mb-3">
                <svg v-for="n in thread.starRating" :key="'f'+n" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg v-for="n in (5 - thread.starRating)" :key="'e'+n" class="w-5 h-5 text-stone-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span class="ml-2 text-sm text-stone-500 font-normal">{{ thread.starRating }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <!-- replies below the thread -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-stone-900 uppercase tracking-wider text-xs flex items-center gap-2">
            <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {{ messages.length }} {{ messages.length === 1 ? 'Message' : 'Messages' }}
          </h2>

          <div v-if="messages.length === 0" class="text-center py-10 text-stone-400 bg-white rounded-2xl border border-stone-200/60">
            <p class="text-sm">No messages yet. Be the first to reply!</p>
          </div>

          <div
            v-for="msg in messages"
            :key="msg.MessageNum"
            class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 flex gap-4"
            :class="{ 'border-amber-200/60 bg-amber-50/20': msg.UserID === currentUserID }"
          >
            <div class="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-600 shrink-0 text-sm shadow-inner">
              {{ msg.AuthorName.charAt(0) }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-semibold text-stone-900 text-sm">{{ msg.AuthorName }}</span>
                <span v-if="msg.UserID === currentUserID" class="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">You</span>
                <span class="text-xs text-stone-400 ml-auto">{{ formatDate(msg.Timestamp) }}</span>
              </div>
              <p class="text-sm text-stone-700 leading-relaxed">{{ msg.Content }}</p>
            </div>
          </div>
        </div>

        <!-- box for writing a reply -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
          <h3 class="text-sm font-bold text-stone-900 mb-4">Leave a Reply</h3>
          <div class="flex gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-700 to-stone-900 flex items-center justify-center font-bold text-stone-50 shrink-0 text-sm shadow-sm">
              A
            </div>
            <div class="flex-1">
              <textarea
                v-model="replyContent"
                rows="3"
                class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition resize-none"
                placeholder="Share your thoughts on this discussion..."
              ></textarea>
              <div class="flex justify-end mt-3">
                <button
                  @click="submitReply"
                  :disabled="!replyContent.trim() || submitting"
                  class="bg-amber-700 hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition flex items-center gap-2"
                >
                  <span v-if="submitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- book and club info stuck to the side -->
      <aside class="lg:col-span-4 space-y-5 sticky top-24">
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">About This Book</h3>
          <div class="flex gap-4">
            <div
              class="w-16 h-24 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0"
              :class="thread ? genreColor(thread.BookTitle) : 'bg-stone-300'"
            >
              BK
            </div>
            <div>
              <div class="font-bold text-stone-900 leading-tight">{{ thread.BookTitle }}</div>
              <div class="text-xs text-stone-500 mt-0.5 mb-3">Cited in this thread</div>
              <RouterLink
                :to="{ name: 'search', query: { q: thread.BookTitle } }"
                class="text-xs font-semibold text-amber-700 hover:underline"
              >
                Find more discussions →
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Club</h3>
          <RouterLink :to="{ name: 'club', params: { id: thread.ClubID } }" class="font-semibold text-amber-700 hover:underline text-sm">{{ thread.ClubName }}</RouterLink>
          <p class="text-xs text-stone-400 mt-0.5">This thread was posted in this club's reading room.</p>
        </div>

        <!-- confirm before nuking the thread -->
        <div v-if="showDeleteConfirm" class="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 class="font-bold text-red-800 text-sm mb-2">Delete this thread?</h3>
          <p class="text-xs text-red-600 mb-4">This will remove the thread and all its messages permanently.</p>
          <p v-if="deleteError" class="text-xs text-red-700 font-semibold mb-3 bg-red-100 rounded-lg px-3 py-2">{{ deleteError }}</p>
          <div class="flex gap-2">
            <button @click="executeDelete" :disabled="deleting" class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-semibold py-2 rounded-lg transition">
              {{ deleting ? 'Deleting...' : 'Yes, delete' }}
            </button>
            <button @click="showDeleteConfirm = false" class="flex-1 bg-white border border-stone-200 text-stone-600 text-xs font-semibold py-2 rounded-lg hover:bg-stone-50 transition">
              Cancel
            </button>
          </div>
        </div>
      </aside>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getThread, getMessages, postMessage, deleteThread } from '../api/thread.js'
import { getMe } from '../api/auth.js'

const route = useRoute()
const router = useRouter()

const currentUserID = ref(null)
const loading = ref(true)
const thread = ref(null)
const messages = ref([])
const replyContent = ref('')
const submitting = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)
const deleteError = ref(null)

onMounted(async () => {
  const id = Number(route.params.id)
  const [me, t, m] = await Promise.all([getMe(), getThread(id), getMessages(id)])
  currentUserID.value = me.data?.userID ?? null
  thread.value = t
  messages.value = m
  loading.value = false
})

async function submitReply() {
  if (!replyContent.value.trim()) return
  submitting.value = true
  const msg = await postMessage(thread.value.ThreadID, replyContent.value.trim())
  messages.value.push(msg)
  replyContent.value = ''
  submitting.value = false
}

function confirmDelete() {
  deleteError.value = null
  showDeleteConfirm.value = true
}

async function executeDelete() {
  deleting.value = true
  deleteError.value = null
  try {
    await deleteThread(thread.value.ThreadID)
    router.push({ name: 'feed' })
  } catch (err) {
    deleteError.value = err.message
    deleting.value = false
  }
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function genreColor() {
  return 'bg-amber-700'
}
</script>
