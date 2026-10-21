<script setup>
/**
 * Topology diagram: the settlement program account at the centre, agent PDAs on
 * two rings, settlement paths drawn as hairlines. Pure SVG + CSS.
 */
import { computed } from 'vue'

const props = defineProps({
  agents: { type: Array, default: () => [] },
  packets: { type: Number, default: 5 }
})

const inner = computed(() => props.agents.slice(0, 3))
const outer = computed(() => props.agents.slice(3, 6))

function pos(radius, index, total) {
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2
  return { x: 200 + radius * Math.cos(angle), y: 200 + radius * Math.sin(angle) }
}
</script>

<template>
  <figure class="rosette" role="img" aria-label="Live agent topology around the settlement program">
    <svg viewBox="0 0 400 400" class="rosette-svg">
      <defs>
        <radialGradient id="mesh-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#a97bff" stop-opacity="0.5" />
          <stop offset="70%" stop-color="#670de5" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#670de5" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="mesh-ray" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a97bff" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#670de5" stop-opacity="0.2" />
        </linearGradient>
      </defs>

      <line x1="200" y1="12" x2="200" y2="388" stroke="#2b2930" stroke-width="1" />
      <line x1="12" y1="200" x2="388" y2="200" stroke="#2b2930" stroke-width="1" />
      <rect x="26" y="26" width="348" height="348" fill="none" stroke="#2b2930" stroke-width="1" />

      <circle cx="200" cy="200" r="150" fill="url(#mesh-core)" />
      <circle cx="200" cy="200" r="132" fill="none" stroke="#2b2930" stroke-width="1" stroke-dasharray="2 6" />
      <circle cx="200" cy="200" r="76" fill="none" stroke="#45414f" stroke-width="1" />

      <line v-for="(a, i) in inner" :key="`li-${a.id}`" x1="200" y1="200"
            :x2="pos(76, i, inner.length).x" :y2="pos(76, i, inner.length).y"
            stroke="url(#mesh-ray)" stroke-width="1.2" />
      <line v-for="(a, i) in outer" :key="`lo-${a.id}`" x1="200" y1="200"
            :x2="pos(132, i, outer.length).x" :y2="pos(132, i, outer.length).y"
            stroke="#45414f" stroke-width="1" />

      <g class="rosette-core">
        <rect x="176" y="176" width="48" height="48" fill="#000000" stroke="#a97bff" stroke-width="1.4" />
        <path d="M211 187 A19 19 0 1 0 211 213" fill="none" stroke="#a97bff" stroke-width="3.2" />
        <path d="M200 184 L200 206" fill="none" stroke="#a97bff" stroke-width="2.4" />
      </g>

      <g v-for="(a, i) in inner" :key="`ii-${a.id}`">
        <circle :cx="pos(76, i, inner.length).x" :cy="pos(76, i, inner.length).y" r="13" fill="#000000" stroke="#2b2930" stroke-width="1" />
        <rect :x="pos(76, i, inner.length).x - 4" :y="pos(76, i, inner.length).y - 4" width="8" height="8" fill="#a97bff" />
      </g>

      <g v-for="(a, i) in outer" :key="`oo-${a.id}`">
        <circle :cx="pos(132, i, outer.length).x" :cy="pos(132, i, outer.length).y" r="16" fill="#000000" stroke="#2b2930" stroke-width="1" />
        <rect :x="pos(132, i, outer.length).x - 5" :y="pos(132, i, outer.length).y - 5" width="10" height="10" fill="#000000" stroke="#a97bff" stroke-width="1.2" />
      </g>
    </svg>

    <div class="rosette-key">
      <span><i class="key-mark key-mark--program"></i>program</span>
      <span><i class="key-mark key-mark--agent"></i>agent pda</span>
      <span><i class="key-mark key-mark--registered"></i>registered</span>
    </div>
  </figure>
</template>
