<script setup>
/**
 * Mast seal: a ruled square, a settlement S and the agent node that signs it.
 * Inline SVG so it follows the page ink; the static favicon twin lives in /public.
 */
defineProps({
  size: { type: Number, default: 34 },
  spin: { type: Boolean, default: false }
})
</script>

<template>
  <svg class="seal" :class="{ 'seal-spin': spin }" :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient :id="`seal-ink-${size}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e0ccff" />
        <stop offset="52%" stop-color="#a97bff" />
        <stop offset="100%" stop-color="#670de5" />
      </linearGradient>
    </defs>
    <rect x="3.5" y="3.5" width="57" height="57" fill="none" stroke="currentColor" stroke-width="1" opacity="0.28" />
    <path d="M43.5 21 C37 15.5 24.5 16.5 23.5 25.5 C22.8 32.8 30.5 31.4 33 33.8 C39.5 39.6 43.6 39.8 42.9 44.3 C41.9 50.9 28.6 52 20.5 45.5"
          fill="none" :stroke="`url(#seal-ink-${size})`" stroke-width="5.4" />
    <rect x="42.4" y="12.2" width="7.6" height="7.6" fill="#000000" stroke="#a97bff" stroke-width="1.8" />
    <path d="M4 60h56" stroke="currentColor" stroke-width="1" opacity="0.28" />
  </svg>
</template>
