<script setup>
defineProps({
  thread: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div>{{ thread.Topic }}</div>
</template>
