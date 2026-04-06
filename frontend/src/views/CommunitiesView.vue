<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- title and create button at the top -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-stone-900" style="font-family: Merriweather, serif;">Communities</h1>
        <p class="text-sm text-stone-500 mt-1">Manage your clubs and discover new ones.</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        New Club
      </button>
    </div>

    <!-- mine vs discover tabs -->
    <div class="flex gap-6 border-b border-stone-200 mb-8">
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
      </button>
    </div>

    <!-- just spin while data loads -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <!-- clubs the user already belongs to -->
    <div v-else-if="activeTab === 'mine'">
      <div v-if="myClubs.length === 0" class="text-center py-20 text-stone-400">
        <p class="font-medium">You haven't joined any clubs yet.</p>
        <button @click="activeTab = 'discover'" class="mt-2 text-amber-700 hover:underline text-sm">Browse public clubs →</button>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="club in myClubs"
          :key="club.ClubID"
          class="bg-white rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4"
        >
          <!-- little initial block for each club -->
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center font-bold text-white text-lg shadow-sm">
              {{ club.Name.charAt(0) }}
            </div>
            <div class="flex items-center gap-2">
              <span v-if="club.isModerator" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                Mod
              </span>
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                :class="club.type === 'Private'
                  ? 'bg-stone-100 text-stone-600 border-stone-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'"
              >
                {{ club.type }}
              </span>
            </div>
          </div>

          <div class="flex-1">
            <h3 class="font-bold text-stone-900">{{ club.Name }}</h3>
            <p class="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">{{ club.Description }}</p>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-400">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {{ club.memberCount }} members
            </span>
            <span v-if="club.currentBook" class="flex items-center gap-1 text-stone-500 italic truncate ml-2">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              {{ club.currentBook }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- browsing public clubs to join -->
    <div v-else-if="activeTab === 'discover'">
      <div class="relative mb-6 max-w-sm">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input v-model="discoverSearch" type="text" class="block w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition" placeholder="Filter clubs...">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="club in filteredPublicClubs"
          :key="club.ClubID"
          class="bg-white rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4"
        >
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm"
              :style="{ background: clubColor(club.ClubID) }">
              {{ club.Name.charAt(0) }}
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Public
            </span>
          </div>

          <div class="flex-1">
            <h3 class="font-bold text-stone-900">{{ club.Name }}</h3>
            <p class="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">{{ club.Description }}</p>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-stone-100">
            <span class="text-xs text-stone-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {{ club.memberCount }}
            </span>
            <button
              @click="handleJoin(club)"
              :disabled="joiningID === club.ClubID"
              class="text-xs font-semibold px-3 py-1.5 rounded-lg border transition"
              :class="joinedIDs.has(club.ClubID)
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800'"
            >
              {{ joinedIDs.has(club.ClubID) ? '✓ Joined' : joiningID === club.ClubID ? 'Joining...' : '+ Join' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- popup form when they want to start a new club -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showCreateModal" class="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4" @click.self="showCreateModal = false">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-stone-900">Create a New Club</h2>
            <button @click="showCreateModal = false" class="text-stone-400 hover:text-stone-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 block">Club Name</label>
              <input v-model="newClub.name" type="text" class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 transition" placeholder="e.g. Mystery Lovers">
            </div>
            <div>
              <label class="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea v-model="newClub.description" rows="3" class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 transition resize-none" placeholder="What is this club about?"></textarea>
            </div>
            <div>
              <label class="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 block">Type</label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-xl border transition" :class="newClub.type === 'Public' ? 'border-amber-500 bg-amber-50' : 'border-stone-200'">
                  <input type="radio" value="Public" v-model="newClub.type" class="accent-amber-700">
                  <div>
                    <div class="text-sm font-medium text-stone-900">Public</div>
                    <div class="text-xs text-stone-400">Anyone can join</div>
                  </div>
                </label>
                <label class="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-xl border transition" :class="newClub.type === 'Private' ? 'border-amber-500 bg-amber-50' : 'border-stone-200'">
                  <input type="radio" value="Private" v-model="newClub.type" class="accent-amber-700">
                  <div>
                    <div class="text-sm font-medium text-stone-900">Private</div>
                    <div class="text-xs text-stone-400">Invite only</div>
                  </div>
                </label>
              </div>
            </div>
            <div v-if="newClub.type === 'Private'">
              <label class="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 block">Join Passcode</label>
              <input v-model="newClub.passcode" type="text" class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 transition" placeholder="Members will need this to join">
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button @click="showCreateModal = false" class="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition">Cancel</button>
            <button @click="handleCreateClub" :disabled="creating" class="flex-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm transition">{{ creating ? 'Creating...' : 'Create Club' }}</button>
          </div>
        </div>
      </div>
    </Transition>

  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMyCommunities, getPublicCommunities, joinClub, createClub } from '../api/communities.js'

const loading = ref(true)
const activeTab = ref('mine')
const tabs = [
  { key: 'mine', label: 'My Clubs' },
  { key: 'discover', label: 'Discover' },
]

const myClubs = ref([])
const publicClubs = ref([])
const discoverSearch = ref('')
const joiningID = ref(null)
const joinedIDs = ref(new Set())
const showCreateModal = ref(false)
const newClub = ref({ name: '', description: '', type: 'Public', passcode: '' })
const creating = ref(false)

const filteredPublicClubs = computed(() => {
  const q = discoverSearch.value.toLowerCase()
  if (!q) return publicClubs.value
  return publicClubs.value.filter(c =>
    c.Name.toLowerCase().includes(q) || c.Description.toLowerCase().includes(q)
  )
})

const COLORS = ['#92400e', '#1e3a5f', '#14532d', '#3b0764', '#7f1d1d', '#0c4a6e']
function clubColor(id) {
  return COLORS[id % COLORS.length]
}

async function handleCreateClub() {
  if (!newClub.value.name.trim()) return
  creating.value = true
  try {
    const club = await createClub(newClub.value)
    myClubs.value.push(club)
    showCreateModal.value = false
    newClub.value = { name: '', description: '', type: 'Public', passcode: '' }
  } finally {
    creating.value = false
  }
}

async function handleJoin(club) {
  if (joinedIDs.value.has(club.ClubID)) return
  joiningID.value = club.ClubID
  try {
    await joinClub(club.ClubID)
    joinedIDs.value = new Set([...joinedIDs.value, club.ClubID])
  } finally {
    joiningID.value = null
  }
}

onMounted(async () => {
  try {
    const [mine, pub] = await Promise.all([getMyCommunities(), getPublicCommunities()])
    myClubs.value = mine
    publicClubs.value = pub
  } catch {
    myClubs.value = []
    publicClubs.value = []
  } finally {
    loading.value = false
  }
})
</script>
