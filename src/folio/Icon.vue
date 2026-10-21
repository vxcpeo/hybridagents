<script setup>
/** Decorative mark: aria-hidden, inherits the type colour of its context. */
import { computed } from 'vue'

const props = defineProps({
  kind: { type: String, default: 'dot' },
  label: { type: String, default: '' }
})

const symbol = computed(() => `#fo-mark-${props.kind || 'dot'}`)
</script>

<template>
  <svg class="fo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"
       stroke-linejoin="round" :aria-hidden="label ? undefined : 'true'" :aria-label="label || undefined"
       :role="label ? 'img' : undefined" focusable="false">
    <use :href="symbol" />
  </svg>
</template>
