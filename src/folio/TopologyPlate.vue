<script setup>
/**
 * The folio plate: the settlement program at the centre of a printed dial, its
 * agent PDAs pinned on two rings and settlement paths drawn as hairlines.
 */
import { computed } from 'vue'

const props = defineProps({
  agents: { type: Array, default: () => [] }
})

const inner = computed(() => props.agents.slice(0, 3))
const outer = computed(() => props.agents.slice(3, 6))

function at(radius, index, total) {
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2
  return { x: 200 + radius * Math.cos(angle), y: 200 + radius * Math.sin(angle) }
}
</script>

<template>
  <figure class="foil-plate" role="img" aria-label="Live agent topology around the settlement program">
    <svg class="foil-platesvg" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="196" fill="none" stroke="#d6cebb" stroke-width="1" />
      <circle cx="200" cy="200" r="166" fill="none" stroke="#d6cebb" stroke-width="1" stroke-dasharray="1 7" />

      <g stroke="#c3baa4" stroke-width="0.8">
        <line v-for="t in 16" :key="`t-${t}`" x1="200" y1="14" x2="200" y2="26"
              :transform="`rotate(${t * 22.5} 200 200)`" />
      </g>

      <circle cx="200" cy="200" r="118" fill="none" stroke="#a79e89" stroke-width="1" />
      <circle cx="200" cy="200" r="72" fill="none" stroke="#a79e89" stroke-width="1" stroke-dasharray="3 5" />

      <line v-for="(a, i) in inner" :key="`ri-${a.id}`" x1="200" y1="200"
            :x2="at(72, i, inner.length).x" :y2="at(72, i, inner.length).y" stroke="#0c5681" stroke-width="1.1" />
      <line v-for="(a, i) in outer" :key="`ro-${a.id}`" x1="200" y1="200"
            :x2="at(118, i, outer.length).x" :y2="at(118, i, outer.length).y" stroke="#8b8677" stroke-width="0.9" />

      <g>
        <circle cx="200" cy="200" r="34" fill="#fffdf6" stroke="#15161a" stroke-width="1.2" />
        <circle cx="200" cy="200" r="21" fill="none" stroke="#0c5681" stroke-width="3" />
        <path d="M213 213 L226 226" stroke="#0c5681" stroke-width="3.6" stroke-linecap="round" />
        <path d="M193 200 L199 206 L209 194" fill="none" stroke="#0c5681" stroke-width="2.6"
              stroke-linecap="round" stroke-linejoin="round" />
      </g>

      <g v-for="(a, i) in inner" :key="`pi-${a.id}`">
        <circle :cx="at(72, i, inner.length).x" :cy="at(72, i, inner.length).y" r="9" fill="#fffdf6" stroke="#15161a" stroke-width="1" />
        <circle :cx="at(72, i, inner.length).x" :cy="at(72, i, inner.length).y" r="3" fill="#0c5681" />
      </g>

      <g v-for="(a, i) in outer" :key="`po-${a.id}`">
        <rect :x="at(118, i, outer.length).x - 7" :y="at(118, i, outer.length).y - 7" width="14" height="14"
              fill="#fffdf6" stroke="#15161a" stroke-width="1" />
        <rect :x="at(118, i, outer.length).x - 2.5" :y="at(118, i, outer.length).y - 2.5" width="5" height="5"
              fill="#0c5681" />
      </g>

    </svg>

    <figcaption class="foil-platekey">
      <span><i class="foil-platekeydot is-solid"></i>program</span>
      <span><i class="foil-platekeydot"></i>agent pda</span>
      <span><i class="foil-platekeydot is-hollow"></i>registered</span>
    </figcaption>
  </figure>
</template>
