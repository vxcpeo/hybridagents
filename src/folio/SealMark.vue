<script setup>
/**
 * The folio seal: the quittance ring with its settled check and receipt tail.
 * Single-colour so it inherits the cover ink; the shaded twin lives in /public.
 */
defineProps({
  size: { type: Number, default: 30 }
})
</script>

<template>
  <svg class="fo-seal" :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="31" cy="31" r="21" fill="none" stroke="currentColor" stroke-width="4.6" />
    <path d="M38 38 L51.5 51.5" fill="none" stroke="currentColor" stroke-width="5.4" stroke-linecap="round" />
    <path d="M22.8 32.2 L29 38.4 L41.2 25.6" fill="none" stroke="currentColor" stroke-width="4.2"
          stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
