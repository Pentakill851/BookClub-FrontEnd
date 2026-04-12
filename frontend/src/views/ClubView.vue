<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="flex flex-col items-center py-24 gap-3 text-stone-500">
      <p class="text-red-600 font-medium">{{ error }}</p>
      <RouterLink to="/communities" class="text-sm text-amber-700 hover:underline">← Back to Communities</RouterLink>
    </div>

    <div v-else>

      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start gap-5">

          <!-- Avatar + info -->
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center font-bold text-white text-2xl shadow-sm shrink-0">
              {{ club.Name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h1 class="text-2xl font-bold text-stone-900" style="font-family: Merriweather, serif;">{{ club.Name }}</h1>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  :class="club.type === 'Private'
                    ? 'bg-stone-100 text-stone-600 border-stone-200'
                    : 'bg-teal-50 text-teal-700 border-teal-200'"
                >
                  {{ club.type }}
                </span>
              </div>
              <p class="text-sm text-stone-500 flex items-center gap-1 mb-2">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ club.memberCount }} {{ club.memberCount === 1 ? 'member' : 'members' }}
              </p>
              <p v-if="club.Description" class="text-sm text-stone-600 leading-relaxed">{{ club.Description }}</p>
            </div>
          </div>

          <!-- Action -->
          <div class="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <span
              v-if="club.isModerator"
              class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" /></svg>
              Moderator
            </span>
            <template v-else>
              <button
                v-if="!club.isMember"
                @click="handleJoin"
                :disabled="actionLoading"
                class="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition"
              >
                {{ actionLoading ? 'Joining…' : '+ Join Club' }}
              </button>
              <button
                v-else
                @click="handleLeave"
                :disabled="actionLoading"
                class="border border-stone-200 text-stone-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 px-5 py-2.5 rounded-full text-sm font-medium transition"
              >
                {{ actionLoading ? 'Leaving…' : 'Leave Club' }}
              </button>
            </template>
            <!-- Invite button — visible to members and moderators -->
            <button
              v-if="club.isMember || club.isModerator"
              @click="openInviteModal"
              class="flex items-center gap-1.5 border border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Invite
            </button>
            <!-- Delete button — mods only -->
            <button
              v-if="club.isModerator"
              @click="showDeleteModal = true"
              class="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete Club
            </button>
            <p v-if="actionError" class="text-xs text-red-600 max-w-[200px] sm:text-right">{{ actionError }}</p>
          </div>
        </div>
      </div>

      <!-- Body grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent threads -->
        <div class="lg:col-span-2 space-y-4">
          <h2 class="text-xs font-bold text-stone-500 uppercase tracking-wider">Recent Discussions</h2>

          <p v-if="club.recentThreads.length === 0" class="bg-white rounded-2xl border border-stone-200/60 p-10 text-center text-stone-400 text-sm">
            No discussions yet.
          </p>

          <RouterLink
            v-for="thread in club.recentThreads"
            :key="thread.ThreadID"
            :to="`/thread/${thread.ThreadID}`"
            class="block bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition no-underline"
          >
            <div class="flex justify-between items-start gap-2 mb-2">
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                :class="thread.isReview
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-stone-100 text-stone-500 border-stone-200'"
              >
                {{ thread.isReview ? 'Review' : 'Discussion' }}
              </span>
              <span class="text-xs text-stone-400 shrink-0">{{ timeAgo(thread.CreatedAt) }}</span>
            </div>
            <h3 class="font-bold text-stone-900 leading-snug mb-1">{{ thread.Topic }}</h3>
            <p class="text-xs text-stone-500">by {{ thread.AuthorName }}</p>
          </RouterLink>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
            <h2 class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Moderators</h2>
            <p v-if="club.moderators.length === 0" class="text-sm text-stone-400">None assigned.</p>
            <ul class="space-y-3">
              <li v-for="mod in club.moderators" :key="mod.UserID" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-600 text-sm shrink-0">
                  {{ mod.Username.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-stone-800">{{ mod.Username }}</span>
              </li>
            </ul>
          </div>

          <!-- Club Reading List -->
          <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
            <h2 class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Reading List</h2>
            <p v-if="!club.books || club.books.length === 0" class="text-sm text-stone-400">No books added yet.</p>
            <ul class="space-y-3">
              <li
                v-for="book in club.books"
                :key="book.ISBN"
                class="flex items-start gap-3"
              >
                <div
                  class="w-9 h-12 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-inner"
                  :class="bookColor(book.Genre)"
                >
                  {{ (book.Genre || 'BK').substring(0, 3).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-stone-900 text-sm leading-tight truncate">{{ book.Title }}</p>
                  <p class="text-xs text-stone-400 mt-0.5">{{ book.Author }}</p>
                  <span
                    v-if="book.ReadingStatus"
                    class="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    :class="statusBadge(book.ReadingStatus)"
                  >{{ book.ReadingStatus }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- Invite member modal -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div
        v-if="showInviteModal"
        class="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4"
        @click.self="closeInviteModal"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-stone-900">Invite to Club</h2>
            <button @click="closeInviteModal" class="text-stone-400 hover:text-stone-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p class="text-sm text-stone-500">Enter the username or email of the person you'd like to invite to <strong class="text-stone-800">{{ club?.Name }}</strong>.</p>
          <input
            v-model="inviteUsername"
            type="text"
            class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 transition"
            placeholder="Username or email"
            @keyup.enter="handleSendInvite"
          />
          <p v-if="inviteError" class="text-sm text-red-600">{{ inviteError }}</p>
          <p v-if="inviteSuccess" class="text-sm text-teal-600 font-medium">{{ inviteSuccess }}</p>
          <div class="flex gap-3 pt-1">
            <button @click="closeInviteModal" class="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition">Cancel</button>
            <button
              @click="handleSendInvite"
              :disabled="inviteLoading || !inviteUsername.trim()"
              class="flex-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm transition"
            >
              {{ inviteLoading ? 'Sending…' : 'Send Invite' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Private club passcode modal -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div
        v-if="showPasscodeModal"
        class="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4"
        @click.self="closePasscodeModal"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-stone-900">Join Private Club</h2>
            <button @click="closePasscodeModal" class="text-stone-400 hover:text-stone-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p class="text-sm text-stone-500">Enter the passcode to join <strong class="text-stone-800">{{ club?.Name }}</strong>.</p>
          <input
            v-model="passcode"
            type="text"
            class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 transition"
            placeholder="Club passcode"
            @keyup.enter="handleJoinPrivate"
          />
          <p v-if="actionError" class="text-sm text-red-600">{{ actionError }}</p>
          <div class="flex gap-3 pt-1">
            <button @click="closePasscodeModal" class="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition">Cancel</button>
            <button
              @click="handleJoinPrivate"
              :disabled="actionLoading || !passcode.trim()"
              class="flex-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm transition"
            >
              {{ actionLoading ? 'Joining…' : 'Join' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete club confirmation modal -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4"
        @click.self="showDeleteModal = false; deleteError = null"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-stone-900">Delete Club</h2>
            <button @click="showDeleteModal = false; deleteError = null" class="text-stone-400 hover:text-stone-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p class="text-sm text-stone-600">
            Are you sure you want to permanently delete <strong class="text-stone-900">{{ club?.Name }}</strong>?
            This will remove all discussions, reading lists, and members. This cannot be undone.
          </p>
          <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{{ deleteError }}</p>
          <div class="flex gap-3 pt-1">
            <button @click="showDeleteModal = false; deleteError = null" class="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition">Cancel</button>
            <button
              @click="handleDeleteClub"
              :disabled="deleteLoading"
              class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm transition"
            >
              {{ deleteLoading ? 'Deleting…' : 'Delete Club' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getClub, joinClub, joinPrivateClub, leaveClub } from '@/api/club.js'
import { sendInvitation } from '@/api/invitations.js'
import { deleteClub } from '@/api/communities.js'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const club = ref(null)
const error = ref(null)
const loading = ref(true)

const actionLoading = ref(false)
const actionError = ref(null)
const showPasscodeModal = ref(false)
const passcode = ref('')

const showInviteModal = ref(false)
const inviteUsername = ref('')
const inviteLoading = ref(false)
const inviteError = ref(null)
const inviteSuccess = ref(null)

const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const deleteError = ref(null)

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return m <= 1 ? 'just now' : `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

async function load() {
  loading.value = true
  error.value = null
  const result = await getClub(route.params.id)
  if (result.error) {
    error.value = result.error
  } else {
    club.value = result.data
  }
  loading.value = false
}

function closePasscodeModal() {
  showPasscodeModal.value = false
  actionError.value = null
  passcode.value = ''
}

async function handleJoin() {
  if (club.value.type === 'Private') {
    actionError.value = null
    showPasscodeModal.value = true
    return
  }
  actionLoading.value = true
  actionError.value = null
  try {
    await joinClub(club.value.ClubID)
    await load()
  } catch (err) {
    actionError.value = err.message
  } finally {
    actionLoading.value = false
  }
}

async function handleJoinPrivate() {
  if (!passcode.value.trim()) return
  actionLoading.value = true
  actionError.value = null
  try {
    await joinPrivateClub(club.value.ClubID, passcode.value)
    showPasscodeModal.value = false
    passcode.value = ''
    await load()
  } catch (err) {
    actionError.value = err.message
  } finally {
    actionLoading.value = false
  }
}

async function handleLeave() {
  actionLoading.value = true
  actionError.value = null
  try {
    await leaveClub(club.value.ClubID)
    await load()
  } catch (err) {
    actionError.value = err.message
  } finally {
    actionLoading.value = false
  }
}

function openInviteModal() {
  inviteUsername.value = ''
  inviteError.value = null
  inviteSuccess.value = null
  showInviteModal.value = true
}

function closeInviteModal() {
  showInviteModal.value = false
}

async function handleSendInvite() {
  if (!inviteUsername.value.trim()) return
  inviteLoading.value = true
  inviteError.value = null
  inviteSuccess.value = null
  try {
    const result = await sendInvitation(inviteUsername.value.trim(), club.value.ClubID)
    inviteSuccess.value = `Invitation sent to ${result.invitedUsername}!`
    inviteUsername.value = ''
  } catch (err) {
    inviteError.value = err.message
  } finally {
    inviteLoading.value = false
  }
}

async function handleDeleteClub() {
  deleteLoading.value = true
  deleteError.value = null
  try {
    await deleteClub(club.value.ClubID)
    router.push('/communities')
  } catch (err) {
    deleteError.value = err.message
    deleteLoading.value = false
  }
}

function bookColor(genre) {
  const map = {
    Dystopian: 'bg-slate-600',
    Classic: 'bg-stone-600',
    Fiction: 'bg-teal-600',
    Fantasy: 'bg-violet-600',
    Drama: 'bg-rose-600',
  }
  return map[genre] || 'bg-amber-700'
}

function statusBadge(status) {
  const map = {
    'Currently Reading': 'bg-teal-50 text-teal-700',
    'Finished': 'bg-stone-100 text-stone-600',
    'Want to Read': 'bg-amber-50 text-amber-700',
  }
  return map[status] || 'bg-stone-100 text-stone-500'
}

onMounted(load)
</script>
