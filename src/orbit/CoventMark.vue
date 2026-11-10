<script setup>
/**
 * Coventa mark for the abyss shell: an orbit ring broken at the upper right,
 * a solid core and the satellite that sits in the gap. Single colour so it
 * inherits whatever surface it is dropped on.
 */
defineProps({
  size: { type: Number, default: 28 }
})
</script>

<template>
  <svg class="ab-mark" :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M51 32 A19 19 0 1 1 35.3 13.29" fill="none" stroke="currentColor" stroke-width="5.4" stroke-linecap="round" />
    <circle cx="32" cy="32" r="4.6" fill="currentColor" />
    <circle cx="46.55" cy="19.79" r="4.2" fill="currentColor" />
  </svg>
</template>
