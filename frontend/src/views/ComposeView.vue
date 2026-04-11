<template>
  <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <RouterLink to="/" class="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 transition mb-6">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      Back to Feed
    </RouterLink>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- all the input fields on the left -->
      <div class="lg:col-span-7 space-y-6">

        <div>
          <h1 class="text-2xl font-bold text-stone-900" style="font-family: Merriweather, serif;">New Post</h1>
          <p class="text-sm text-stone-500 mt-1">Start a discussion or log a book review.</p>
        </div>

        <!-- discussion or review, pick one -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-1.5 flex gap-1">
          <button
            @click="mode = 'discussion'"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition"
            :class="mode === 'discussion'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-800'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Discussion
          </button>
          <button
            @click="mode = 'review'"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition"
            :class="mode === 'review'
              ? 'bg-amber-700 text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-800'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            Book Review
          </button>
        </div>

        <!-- search and pick a book to attach -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 space-y-3">
          <label class="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            {{ mode === 'review' ? 'Book Being Reviewed' : 'Cite a Book' }}
            <span v-if="mode === 'review'" class="text-red-500 text-xs">*</span>
          </label>

          <div class="relative">
            <input
              type="text"
              v-model="bookSearch"
              @input="onBookSearch"
              @focus="showBookDropdown = true"
              class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-stone-50 transition"
              placeholder="Search by title or author..."
            >
            <div
              v-if="showBookDropdown && bookOptions.length > 0"
              class="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-10 overflow-hidden"
            >
              <button
                v-for="book in bookOptions"
                :key="book.ISBN"
                @click="selectBook(book)"
                class="w-full text-left px-4 py-3 text-sm hover:bg-amber-50 hover:text-amber-900 transition border-b border-stone-100 last:border-0"
              >
                <div class="font-medium text-stone-900">{{ book.Title }}</div>
                <div class="text-xs text-stone-500">{{ book.Author }}</div>
              </button>
            </div>
          </div>

          <div v-if="selectedBook" class="flex items-center gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
            <div class="w-8 h-10 bg-amber-700 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0">BK</div>
            <div>
              <div class="text-sm font-semibold text-stone-900">{{ selectedBook.Title }}</div>
              <div class="text-xs text-stone-500">{{ selectedBook.Author }}</div>
            </div>
            <button @click="selectedBook = null; bookSearch = ''" class="ml-auto text-stone-400 hover:text-red-500 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <p v-if="booksError" class="text-sm text-red-600 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ booksError }}
          </p>
        </div>

        <!-- which club this post is going into -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 space-y-3">
          <label class="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Post to Club
            <span class="text-red-500 text-xs">*</span>
          </label>
          <div class="grid grid-cols-1 gap-2">
            <label
              v-for="club in clubs"
              :key="club.ClubID"
              class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
              :class="selectedClubID === club.ClubID
                ? 'border-amber-500 bg-amber-50'
                : 'border-stone-200 hover:border-stone-300'"
            >
              <input type="radio" :value="club.ClubID" v-model="selectedClubID" class="accent-amber-700">
              <div>
                <div class="text-sm font-medium text-stone-900">{{ club.Name }}</div>
                <div class="text-xs text-stone-400">{{ club.type }}</div>
              </div>
            </label>
          </div>

          <p v-if="clubsError" class="text-sm text-red-600 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ clubsError }}
          </p>
        </div>

        <!-- the post title basically -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 space-y-3">
          <label class="text-sm font-semibold text-stone-900">
            Topic / Title
            <span class="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            v-model="topic"
            maxlength="255"
            class="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-stone-50 transition"
            placeholder="e.g. The symbolism of the green light..."
          >
        </div>

        <!-- stars only appear for review mode -->
        <div v-if="mode === 'review'" class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 space-y-3">
          <label class="text-sm font-semibold text-stone-900">
            Your Rating
            <span class="text-red-500 text-xs">*</span>
          </label>
          <div class="flex items-center gap-2">
            <button
              v-for="star in 5"
              :key="star"
              @click="starRating = star"
              class="transition"
              :class="star <= starRating ? 'text-amber-500' : 'text-stone-200 hover:text-amber-300'"
            >
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </button>
            <span v-if="starRating" class="text-sm text-stone-500 ml-2">{{ ratingLabel }}</span>
          </div>
        </div>

        <!-- the actual body of the post -->
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 space-y-3">
          <label class="text-sm font-semibold text-stone-900">
            {{ mode === 'review' ? 'Your Review' : 'Opening Message' }}
            <span class="text-red-500 text-xs">*</span>
          </label>
          <textarea
            v-model="content"
            rows="5"
            class="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-stone-50 transition resize-none"
            :placeholder="mode === 'review'
              ? 'Share your thoughts on the book...'
              : 'Start the discussion with your opening thoughts...'"
          ></textarea>
          <div class="text-xs text-stone-400 text-right">{{ content.length }} characters</div>
        </div>

        <!-- validation error message and publish button -->
        <div class="flex items-center justify-between">
          <p v-if="formError" class="text-sm text-red-600 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ formError }}
          </p>
          <div v-else></div>
          <button
            @click="submit"
            :disabled="submitting"
            class="bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white px-8 py-3 rounded-full font-medium shadow-sm transition flex items-center gap-2"
          >
            <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Publish
          </button>
        </div>
      </div>

      <!-- live preview of how it looks in the feed -->
      <aside class="lg:col-span-5 sticky top-24">
        <div class="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-stone-500">Preview</span>
            <span class="text-xs text-stone-400">How it will look in the feed</span>
          </div>

          <div class="p-6">
            <!-- preview header showing the club and cited book -->
            <div class="flex items-center gap-2 text-xs font-medium text-stone-500 mb-4">
              <span class="text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-100">
                {{ selectedClubName || 'Select a club...' }}
              </span>
              <span v-if="selectedBook" class="text-stone-300">&bull;</span>
              <span v-if="selectedBook"><em class="text-stone-700 font-medium">"{{ selectedBook.Title }}"</em></span>
            </div>

            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-700 to-stone-900 flex items-center justify-center font-bold text-stone-50 shrink-0 text-sm shadow-inner">
                {{ currentUser?.username?.[0]?.toUpperCase() || '?' }}
              </div>
              <div class="flex-1">
                <div class="font-bold text-stone-900 mb-1">{{ currentUser?.username || 'Loading...' }}</div>
                <h3 class="font-bold text-stone-900 text-lg leading-tight mb-2">
                  {{ topic || 'Your topic will appear here...' }}
                </h3>
                <div v-if="mode === 'review' && starRating" class="flex text-amber-500 mb-2">
                  <svg v-for="n in starRating" :key="n" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
                <p class="text-sm text-stone-500 border-l-2 border-stone-200 pl-3 italic leading-relaxed">
                  {{ content ? `"${content.substring(0, 160)}${content.length > 160 ? '...' : ''}"` : 'Your opening message...' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- some quick writing tips below the preview -->
        <div class="mt-4 bg-stone-50 rounded-2xl border border-stone-200/60 p-4 space-y-2">
          <p class="text-xs font-bold text-stone-600 uppercase tracking-wider">Tips</p>
          <ul class="space-y-1.5 text-xs text-stone-500">
            <li class="flex items-start gap-1.5"><span class="text-amber-600 mt-0.5">•</span> A clear topic title gets more replies.</li>
            <li class="flex items-start gap-1.5"><span class="text-amber-600 mt-0.5">•</span> Reviews should include specific passages you liked or didn't.</li>
            <li class="flex items-start gap-1.5"><span class="text-amber-600 mt-0.5">•</span> Discussions work best with an open-ended question.</li>
          </ul>
        </div>
      </aside>

    </div>

    <!-- flash a success message then redirect -->
    <Transition enter-from-class="opacity-0 translate-y-4" enter-active-class="transition duration-300" leave-to-class="opacity-0 translate-y-4" leave-active-class="transition duration-300">
      <div v-if="showSuccess" class="fixed bottom-6 right-6 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium">
        <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        Published! Redirecting to feed...
      </div>
    </Transition>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getClubsForCompose, searchBooksForCite, createThread, createReview } from '../api/compose.js'
import { getMe } from '../api/auth.js'

const router = useRouter()

const mode = ref('discussion')
const clubs = ref([])
const selectedClubID = ref(null)
const bookSearch = ref('')
const bookOptions = ref([])
const selectedBook = ref(null)
const showBookDropdown = ref(false)
const topic = ref('')
const content = ref('')
const starRating = ref(0)
const submitting = ref(false)
const formError = ref('')
const showSuccess = ref(false)
const currentUser = ref(null)
const clubsError = ref('')
const booksError = ref('')

const selectedClubName = computed(() => {
  const club = clubs.value.find(c => c.ClubID === selectedClubID.value)
  return club?.Name || ''
})

const ratingLabel = computed(() => {
  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']
  return labels[starRating.value] || ''
})

let searchTimer = null
function onBookSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    try {
      booksError.value = ''
      bookOptions.value = await searchBooksForCite(bookSearch.value)
      showBookDropdown.value = true
    } catch (err) {
      booksError.value = err.message
      bookOptions.value = []
    }
  }, 200)
}

function selectBook(book) {
  selectedBook.value = book
  bookSearch.value = ''
  showBookDropdown.value = false
  bookOptions.value = []
}

function closeDropdown(e) {
  if (!e.target.closest('.relative')) showBookDropdown.value = false
}

function validate() {
  if (!selectedClubID.value) return 'Please select a club.'
  if (!topic.value.trim()) return 'Please enter a topic.'
  if (!content.value.trim()) return 'Please write an opening message.'
  if (mode.value === 'review' && !selectedBook.value) return 'Please select a book to review.'
  if (mode.value === 'review' && !starRating.value) return 'Please select a star rating.'
  return ''
}

async function submit() {
  formError.value = validate()
  if (formError.value) return

  submitting.value = true

  try {
    let result
    if (mode.value === 'review') {
      result = await createReview({
        clubID: selectedClubID.value,
        isbn: selectedBook.value.ISBN,
        topic: topic.value.trim(),
        content: content.value.trim(),
        starRating: starRating.value,
      })
    } else {
      result = await createThread({
        clubID: selectedClubID.value,
        isbn: selectedBook.value?.ISBN || null,
        topic: topic.value.trim(),
        content: content.value.trim(),
      })
    }

    submitting.value = false
    showSuccess.value = true
    setTimeout(() => router.push(`/thread/${result.threadID}`), 1800)
  } catch (err) {
    submitting.value = false
    formError.value = err.message
  }
}

onMounted(async () => {
  try {
    const meResult = await getMe()
    if (meResult.data) {
      currentUser.value = meResult.data
    }
  } catch (err) {
    console.error('Failed to load user:', err)
  }

  try {
    clubsError.value = ''
    clubs.value = await getClubsForCompose()
  } catch (err) {
    clubsError.value = err.message
  }

  document.addEventListener('click', closeDropdown)
})
onBeforeUnmount(() => document.removeEventListener('click', closeDropdown))
</script>
