<template>
  <div class="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-amber-100 selection:text-amber-900 flex flex-col">
    
    <nav class="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
      <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center gap-8">
        <div class="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900 shrink-0">
          <div class="bg-amber-700 text-white p-1.5 rounded-lg shadow-sm border border-amber-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          BookClubDB
        </div>

        <div class="flex-1 max-w-2xl hidden md:block">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-stone-400 group-focus-within:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" v-model="searchQuery" class="block w-full pl-11 pr-4 py-2 border border-stone-200 rounded-full leading-5 bg-stone-50 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 sm:text-sm transition-all" placeholder="Search the archives...">
          </div>
        </div>

        <div class="flex items-center gap-6 shrink-0">
          <a href="#" class="text-sm font-medium text-stone-500 hover:text-stone-900 hidden lg:block transition">Discover</a>
          <a href="#" class="text-sm font-medium text-stone-500 hover:text-stone-900 hidden lg:block transition">My Books</a>
          
          <div class="relative cursor-pointer hover:text-amber-700 transition text-stone-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span v-if="invitations.length > 0" class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white"></span>
          </div>

          <div class="flex items-center gap-2 pl-5 border-l border-stone-200 cursor-pointer group">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-700 to-stone-900 flex items-center justify-center font-bold text-stone-50 shadow-sm ring-2 ring-transparent group-hover:ring-amber-200 transition">
              {{ user?.username.charAt(0) || '?' }}
            </div>
            <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4 animate-pulse">
        <div class="w-12 h-12 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin"></div>
        <div class="text-stone-500 font-medium tracking-wide text-sm uppercase">Dusting off the shelves...</div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <aside class="lg:col-span-3 space-y-6 sticky top-24">
          
          <div class="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6 text-center">
            <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-stone-700 to-stone-900 flex items-center justify-center font-bold text-3xl text-stone-50 shadow-md mb-4 border border-stone-600">
              {{ user.username.charAt(0) }}
            </div>
            <h2 class="text-lg font-bold text-stone-900">{{ user.username }}</h2>
            <p class="text-sm text-stone-500 mb-4">{{ user.email }}</p>
            <div class="flex justify-center gap-4 border-t border-stone-100 pt-4">
              <div>
                <div class="font-bold text-stone-900">{{ myBooks.length }}</div>
                <div class="text-xs text-stone-500">Books</div>
              </div>
              <div class="w-px bg-stone-200"></div>
              <div>
                <div class="font-bold text-stone-900">4</div>
                <div class="text-xs text-stone-500">Reviews</div>
              </div>
            </div>
          </div>

          <div v-if="invitations.length > 0" class="bg-amber-50/50 rounded-2xl border border-amber-200/60 p-5">
            <h3 class="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path></svg>
              Club Invitations
            </h3>
            <div v-for="invite in invitations" :key="invite.InviteID" class="bg-white rounded-xl p-3 shadow-sm border border-amber-100 mb-2">
              <p class="text-sm font-medium text-stone-800">{{ invite.ClubName }}</p>
              <div class="flex gap-2 mt-3">
                <button class="flex-1 bg-amber-700 text-white text-xs font-medium py-1.5 rounded-lg shadow-sm hover:bg-amber-800 transition">Accept</button>
                <button class="flex-1 bg-white border border-stone-200 text-stone-600 text-xs font-medium py-1.5 rounded-lg hover:bg-stone-50 transition">Decline</button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-5">
            <h3 class="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs">My Communities</h3>
            <ul class="space-y-4">
              <li v-for="club in myClubs" :key="club.ClubID" class="flex items-center justify-between group cursor-pointer">
                <div>
                  <div class="font-medium text-sm text-stone-800 group-hover:text-amber-700 transition">{{ club.Name }}</div>
                  <div class="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                    <span v-if="club.isModerator" class="text-amber-700 bg-amber-50 px-1.5 rounded flex items-center gap-0.5 border border-amber-100/50">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                      Mod
                    </span>
                    <span v-else>{{ club.type }}</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-stone-300 group-hover:text-amber-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </li>
            </ul>
          </div>
        </aside>

        <div class="lg:col-span-6 space-y-6">
          
          <div class="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-5 flex gap-4">
             <div class="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0">
              {{ user.username.charAt(0) }}
            </div>
            <div class="flex-1">
              <input type="text" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" placeholder="Draft a new discussion or log a review...">
              <div class="flex justify-between items-center mt-3">
                <div class="flex gap-2">
                  <button class="text-xs font-medium text-stone-600 hover:text-amber-700 flex items-center gap-1 bg-stone-50 px-2 py-1.5 rounded-lg transition border border-stone-200/60"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> Cite Book</button>
                  <button class="text-xs font-medium text-stone-600 hover:text-amber-700 flex items-center gap-1 bg-stone-50 px-2 py-1.5 rounded-lg transition border border-stone-200/60"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg> Add Review</button>
                </div>
                <button class="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition">Publish</button>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-end pb-2 border-b border-stone-200">
            <h2 class="text-lg font-bold text-stone-900">The Reading Room</h2>
            <div class="flex gap-4 text-sm font-medium">
              <span class="text-amber-700 border-b-2 border-amber-700 pb-2 cursor-pointer">My Circles</span>
              <span class="text-stone-400 hover:text-stone-600 pb-2 cursor-pointer transition">Public Archive</span>
            </div>
          </div>

          <div class="space-y-5">
            <article v-for="thread in threads" :key="thread.ThreadID" class="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
              
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-2 text-xs font-medium text-stone-500">
                  <span class="text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-100">{{ thread.ClubName }}</span>
                  <span class="text-stone-300">&bull;</span>
                  <span>Discussing: <em class="text-stone-700 font-medium">"{{ thread.BookTitle }}"</em></span>
                </div>
                <span class="text-xs text-stone-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ thread.timeAgo }}
                </span>
              </div>

              <div class="flex gap-4 mb-5">
                <div class="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-600 shrink-0 shadow-inner text-sm">
                  {{ thread.AuthorName.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-stone-900">{{ thread.AuthorName }}</span>
                  </div>
                  <h3 class="font-bold text-stone-900 text-lg mb-1 leading-tight">{{ thread.Topic }}</h3>
                  
                  <div v-if="thread.isReview" class="flex text-amber-500 mb-2">
                     <svg v-for="n in thread.starRating" :key="n" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                  
                  <p class="text-sm text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-3 italic">"{{ thread.initialMessage }}"</p>
                </div>
              </div>

              <div v-if="thread.latestReply" class="ml-14 bg-stone-50/80 rounded-xl p-3.5 border border-stone-100 flex gap-3 mb-4">
                 <div class="w-6 h-6 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-[10px] font-bold text-stone-700 shrink-0">
                  {{ thread.latestReply.author.charAt(0) }}
                </div>
                <div class="text-sm">
                  <span class="font-semibold text-stone-900">{{ thread.latestReply.author }}</span>
                  <span class="text-stone-600 ml-1">{{ thread.latestReply.content }}</span>
                </div>
              </div>

              <div class="ml-14 flex items-center gap-6 text-xs font-semibold text-stone-500 pt-3 border-t border-stone-100">
                <button class="flex items-center gap-1.5 hover:text-amber-700 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  {{ thread.replyCount }} Replies
                </button>
                <button class="flex items-center gap-1.5 hover:text-rose-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  Like
                </button>
              </div>
            </article>
          </div>
        </div>

        <aside class="lg:col-span-3 space-y-6 sticky top-24">
          
          <div class="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-5">
            <h3 class="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs flex justify-between">
              My Books <span class="text-amber-700 font-normal hover:underline cursor-pointer">Library</span>
            </h3>
            <ul class="space-y-5">
              <li v-for="book in myBooks" :key="book.ISBN" class="flex gap-3">
                <div class="w-12 h-16 bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-stone-500 shadow-inner shrink-0">
                  {{ book.Genre.substring(0,3).toUpperCase() }}
                </div>
                <div class="flex flex-col justify-center">
                  <div class="font-medium text-sm text-stone-900 leading-tight mb-0.5">{{ book.Title }}</div>
                  <div class="text-xs text-stone-500 mb-1.5">{{ book.Author }}</div>
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
                      :class="{
                        'bg-emerald-50 text-emerald-700 border border-emerald-200/60': book.Status === 'Read',
                        'bg-amber-100 text-amber-800 border border-amber-200/60': book.Status === 'In Progress',
                        'bg-stone-100 text-stone-600 border border-stone-200': book.Status === 'Want to Read'
                      }">
                      {{ book.Status }}
                    </span>
                    
                    <div v-if="book.PersonalRating" class="flex text-amber-500">
                      <svg v-for="n in book.PersonalRating" :key="n" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-5">
            <h3 class="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs">Suggested For You</h3>
            <div class="space-y-4">
              <div v-for="club in recommendedClubs" :key="club.ClubID" class="flex flex-col gap-2 pb-4 border-b border-stone-50 last:border-0 last:pb-0">
                <div>
                  <div class="font-semibold text-sm text-stone-800">{{ club.Name }}</div>
                  <div class="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{{ club.Description }}</div>
                </div>
                <button class="text-xs font-semibold bg-stone-50 border border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 text-stone-600 py-2 px-3 rounded-lg transition w-full">
                  + Join Public Club
                </button>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const searchQuery = ref('')

const user = ref(null)
const invitations = ref([])
const myClubs = ref([])
const threads = ref([])
const recommendedClubs = ref([])
const myBooks = ref([])

// fake api call, loads everything after a short delay
onMounted(() => {
  setTimeout(() => {
    user.value = { UserID: 1, username: 'Alice', email: 'alice@sfu.ca' }

    invitations.value = [
      { InviteID: 5, ClubName: 'Mystery Solvers' },
      { InviteID: 6, ClubName: 'Local Authors' }
    ]

    myClubs.value = [
      { ClubID: 1, Name: 'Sci-Fi Explorers', type: 'Private', isModerator: true },
      { ClubID: 6, Name: 'Tolkien Fanatics', type: 'Public', isModerator: false },
      { ClubID: 2, Name: 'Classic Lit', type: 'Public', isModerator: false }
    ]

    recommendedClubs.value = [
      { ClubID: 3, Name: 'Fantasy Realm', Description: 'Swords, sorcery, and everything magic.' },
      { ClubID: 7, Name: 'The Gatsby Club', Description: 'A deep dive into the symbolism of the Roaring 20s.' },
      { ClubID: 8, Name: 'Historical Fiction Readers', Description: 'Travel back in time through literature.' }
    ]

    myBooks.value = [
      { ISBN: '9780451524935', Title: '1984', Author: 'George Orwell', Genre: 'Dystopian', Status: 'Read', PersonalRating: 5 },
      { ISBN: '9780345339683', Title: 'The Hobbit', Author: 'J.R.R. Tolkien', Genre: 'Fantasy', Status: 'In Progress', PersonalRating: null },
      { ISBN: '9780061120084', Title: 'To Kill a Mockingbird', Author: 'Harper Lee', Genre: 'Fiction', Status: 'Read', PersonalRating: 4 },
      { ISBN: '9780140449136', Title: 'War and Peace', Author: 'Leo Tolstoy', Genre: 'Classic', Status: 'Want to Read', PersonalRating: null }
    ]

    threads.value = [
      { 
        ThreadID: 1, 
        Topic: 'Orwell Predictions', 
        ClubName: 'Sci-Fi Explorers', 
        BookTitle: '1984', 
        AuthorName: 'Alice', 
        timeAgo: '2 hours ago',
        isReview: true,
        starRating: 5, 
        initialMessage: 'This book was ahead of its time. The concepts of surveillance are terrifyingly relevant today.', 
        latestReply: { author: 'Bob', content: 'I completely agree! The telescreens got me.' }, 
        replyCount: 14
      },
      { 
        ThreadID: 3, 
        Topic: 'Hobbit Journey pacing', 
        ClubName: 'Tolkien Fanatics', 
        BookTitle: 'The Hobbit', 
        AuthorName: 'Charlie', 
        timeAgo: '5 hours ago',
        isReview: false,
        starRating: null, 
        initialMessage: 'Does anyone else feel like the journey to the Misty Mountains drags on just a little bit too long?', 
        latestReply: { author: 'Evan', content: 'It builds the atmosphere! You need to feel the distance.' }, 
        replyCount: 8
      },
      { 
        ThreadID: 2, 
        Topic: 'Gatsby Symbolism', 
        ClubName: 'Classic Lit', 
        BookTitle: 'The Great Gatsby', 
        AuthorName: 'Bob', 
        timeAgo: '1 day ago',
        isReview: true,
        starRating: 4, 
        initialMessage: 'The green light is fascinating. It represents the unattainable American Dream so perfectly.', 
        latestReply: null, 
        replyCount: 0
      },
      { 
        ThreadID: 5, 
        Topic: 'Is this book worth the length?', 
        ClubName: 'Classic Lit', 
        BookTitle: 'War and Peace', 
        AuthorName: 'Dana', 
        timeAgo: '2 days ago',
        isReview: false,
        starRating: null, 
        initialMessage: 'I am on page 300 and taking a break. Someone please tell me the ending makes the commitment worth it.', 
        latestReply: { author: 'Alice', content: 'Stick with it! The character arcs are incredible.' }, 
        replyCount: 22
      }
    ]

    loading.value = false
  }, 800)
})
</script>