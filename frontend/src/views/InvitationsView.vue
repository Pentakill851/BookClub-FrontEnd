<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-stone-900" style="font-family: Merriweather, serif;">Invitations</h1>
      <p class="text-sm text-stone-500 mt-1">Clubs that have invited you to join.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="invitations.length === 0" class="text-center py-32">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
      </div>
      <p class="text-stone-500 font-medium">No pending invitations.</p>
    </div>

    <div v-else class="max-w-xl space-y-4">
      <div
        v-for="invite in invitations"
        :key="invite.InviteID"
        class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0">
            {{ invite.ClubName.charAt(0) }}
          </div>
          <div>
            <p class="font-semibold text-stone-900">{{ invite.ClubName }}</p>
            <p class="text-xs text-stone-400 mt-0.5">invited by {{ invite.InvitedBy }} · {{ formatDate(invite.SentAt) }}</p>
          </div>
        </div>

        <div class="flex gap-2 shrink-0">
          <button
            @click="handleInvite(invite.InviteID, 'decline')"
            :disabled="pendingID === invite.InviteID"
            class="border border-stone-200 text-stone-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-stone-50 disabled:opacity-50 transition"
          >
            Decline
          </button>
          <button
            @click="handleInvite(invite.InviteID, 'accept')"
            :disabled="pendingID === invite.InviteID"
            class="bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm disabled:opacity-50 transition"
          >
            {{ pendingID === invite.InviteID ? '...' : 'Accept' }}
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getInvitations, acceptInvitation, declineInvitation } from '../api/invitations.js'

const loading = ref(true)
const invitations = ref([])
const pendingID = ref(null)

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function handleInvite(inviteID, action) {
  pendingID.value = inviteID
  try {
    if (action === 'accept') {
      await acceptInvitation(inviteID)
    } else {
      await declineInvitation(inviteID)
    }
    invitations.value = invitations.value.filter(i => i.InviteID !== inviteID)
  } finally {
    pendingID.value = null
  }
}

onMounted(async () => {
  try {
    invitations.value = await getInvitations()
  } catch {
    invitations.value = []
  } finally {
    loading.value = false
  }
})
</script>
