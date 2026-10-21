<script setup>
/**
 * Stakri mark: slot ring + settlement S + agent node at the write head.
 * Inline SVG so it inherits page context; the raster/favicon twins live in /public/brand.
 */
defineProps({
  size: { type: Number, default: 32 },
  spin: { type: Boolean, default: false }
})
</script>

<template>
  <svg class="mark" :class="{ 'mark--spin': spin }" :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient :id="`cm-a-${size}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#22f5c8" />
        <stop offset="52%" stop-color="#00d0ff" />
        <stop offset="100%" stop-color="#7c5cff" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.22" />
    <circle cx="32" cy="32" r="29" fill="none" :stroke="`url(#cm-a-${size})`" stroke-width="1.6"
            stroke-dasharray="7 175" stroke-dashoffset="-10" opacity="0.95" />
    <path d="M43.5 21 C37 15.5 24.5 16.5 23.5 25.5 C22.8 32.8 30.5 31.4 33 33.8 C39.5 39.6 43.6 39.8 42.9 44.3 C41.9 50.9 28.6 52 20.5 45.5"
          fill="none" :stroke="`url(#cm-a-${size})`" stroke-width="6.4" />
    <circle cx="46.8" cy="16.6" r="3.9" fill="#04070f" stroke="#22f5c8" stroke-width="2.4" />
  </svg>
</template>

<style scoped>
.mark { flex: 0 0 auto; }
.mark--spin { animation: spin 11s linear infinite; }
</style>
