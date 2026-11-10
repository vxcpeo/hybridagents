<script setup>
/**
 * Decorative orbital field behind the opening statement: concentric arcs, a
 * graduated tick ring and six agent nodes pinned to the outer orbits. Purely
 * presentational (aria-hidden); the readable topology values live in the copy.
 */
import { computed } from 'vue'

const props = defineProps({
  agents: { type: Array, default: () => [] }
})

const inner = computed(() => props.agents.slice(0, 3))
const outer = computed(() => props.agents.slice(3, 6))

function at(radius, index, total) {
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2
  return { x: 400 + radius * Math.cos(angle), y: 400 + radius * Math.sin(angle) }
}
</script>

<template>
  <svg class="ab-orbit-field" viewBox="0 0 800 800" aria-hidden="true" focusable="false">
    <g class="ab-orbit-field-rings">
      <circle cx="400" cy="400" r="392" />
      <circle cx="400" cy="400" r="338" stroke-dasharray="2 12" />
      <circle cx="400" cy="400" r="252" />
      <circle cx="400" cy="400" r="170" stroke-dasharray="1 9" />
    </g>

    <g class="ab-orbit-field-ticks">
      <line v-for="t in 72" :key="`tk-${t}`" x1="400" y1="18" x2="400" :y2="t % 6 === 0 ? 34 : 26"
            :transform="`rotate(${t * 5} 400 400)`" />
    </g>

    <g class="ab-orbit-field-arcs">
      <path d="M 148 400 A 252 252 0 0 1 652 400" />
      <path d="M 230 400 A 170 170 0 0 1 570 400" />
    </g>

    <g class="ab-orbit-field-links">
      <line v-for="(a, i) in inner" :key="`li-${a.id}`" x1="400" y1="400"
            :x2="at(170, i, inner.length).x" :y2="at(170, i, inner.length).y" />
      <line v-for="(a, i) in outer" :key="`lo-${a.id}`" x1="400" y1="400"
            :x2="at(252, i, outer.length).x" :y2="at(252, i, outer.length).y" />
    </g>

    <g class="ab-orbit-field-nodes">
      <circle v-for="(a, i) in inner" :key="`ni-${a.id}`" :cx="at(170, i, inner.length).x"
              :cy="at(170, i, inner.length).y" r="7" />
      <circle v-for="(a, i) in outer" :key="`no-${a.id}`" :cx="at(252, i, outer.length).x"
              :cy="at(252, i, outer.length).y" r="4.5" />
    </g>

    <g class="ab-orbit-field-core">
      <circle cx="400" cy="400" r="54" />
      <circle cx="400" cy="400" r="26" />
      <path d="M 400 374 A 26 26 0 0 1 400 426" />
    </g>
  </svg>
</template>
