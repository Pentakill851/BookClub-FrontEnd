<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div>{{ book.Title }}</div>
</template>
