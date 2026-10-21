<script setup>
/**
 * NetworkOrb - the trust graph: the program account at the centre, agent PDAs on
 * two orbits, live settlement packets travelling inward. Pure SVG + CSS.
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
  <div class="orb" role="img" aria-label="Live agent topology around the settlement program">
    <svg viewBox="0 0 400 400" class="orb__svg">
      <defs>
        <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#22f5c8" stop-opacity="0.9" />
          <stop offset="55%" stop-color="#00d0ff" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#7c5cff" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="orb-link" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22f5c8" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#7c5cff" stop-opacity="0.25" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(120,180,255,0.10)" />
      <circle cx="200" cy="200" r="132" fill="none" stroke="rgba(120,180,255,0.14)" stroke-dasharray="3 7" />
      <circle cx="200" cy="200" r="76" fill="none" stroke="rgba(120,180,255,0.2)" />

      <circle cx="200" cy="200" r="150" fill="url(#orb-core)" opacity="0.5" />

      <!-- links -->
      <line v-for="(a, i) in inner" :key="`li-${a.id}`" x1="200" y1="200"
            :x2="pos(76, i, inner.length).x" :y2="pos(76, i, inner.length).y"
            stroke="url(#orb-link)" stroke-width="1.4" />
      <line v-for="(a, i) in outer" :key="`lo-${a.id}`" x1="200" y1="200"
            :x2="pos(132, i, outer.length).x" :y2="pos(132, i, outer.length).y"
            stroke="url(#orb-link)" stroke-width="1" opacity="0.6" />

      <!-- settlement packets travelling to the core -->
      <circle v-for="n in packets" :key="`p-${n}`" r="2.6" fill="#c8ff4d" class="orb__packet"
              :style="{ animationDelay: `${n * 0.9}s`, '--ang': `${n * 72}deg` }" />

      <!-- inner orbit: actively settling agents -->
      <g v-for="(a, i) in inner" :key="`ii-${a.id}`">
        <circle :cx="pos(76, i, inner.length).x" :cy="pos(76, i, inner.length).y" r="12"
                fill="rgba(34,245,200,0.10)" stroke="#22f5c8" stroke-width="1.2" />
        <circle :cx="pos(76, i, inner.length).x" :cy="pos(76, i, inner.length).y" r="3.4" fill="#22f5c8" />
      </g>

      <!-- outer orbit: registered agents -->
      <g v-for="(a, i) in outer" :key="`oo-${a.id}`">
        <rect :x="pos(132, i, outer.length).x - 9" :y="pos(132, i, outer.length).y - 9" width="18" height="18"
              rx="4" fill="rgba(124,92,255,0.12)" stroke="#7c5cff" stroke-width="1.2" />
        <circle :cx="pos(132, i, outer.length).x" :cy="pos(132, i, outer.length).y" r="2.6" fill="#cbb6ff" />
      </g>

      <!-- core: the program account, carrying the Stakri glyph -->
      <circle cx="200" cy="200" r="30" fill="rgba(4,7,15,0.92)" stroke="#00d0ff" stroke-width="1.3" />
      <circle cx="200" cy="200" r="30" fill="none" stroke="#00d0ff" stroke-width="1.3"
              stroke-dasharray="10 180" class="orb__sweep" />
      <path d="M211 187 A19 19 0 1 0 211 213" fill="none" stroke="#00d0ff" stroke-width="4.6" />
      <path d="M200 184 L200 206" fill="none" stroke="#00d0ff" stroke-width="3.4" />
      <circle cx="200" cy="211" r="3.4" fill="#04070f" stroke="#22f5c8" stroke-width="2.2" />
    </svg>

    <div class="orb__legend">
      <span class="mono"><i class="dot dot--core"></i>program</span>
      <span class="mono"><i class="dot dot--agent"></i>agent pda</span>
      <span class="mono"><i class="dot dot--reg"></i>registered</span>
    </div>
  </div>
</template>

<style scoped>
.orb { position: relative; width: min(460px, 92vw); aspect-ratio: 1; margin: 0 auto; }
.orb__svg { width: 100%; height: 100%; overflow: visible; }
.orb__sweep { transform-origin: 200px 200px; animation: spin 8s linear infinite; }
.orb__packet { animation: fall 4.5s var(--ease) infinite; transform-origin: 200px 200px; }
@keyframes fall {
  0% { transform: rotate(var(--ang)) translateY(-132px); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: rotate(var(--ang)) translateY(-18px); opacity: 0; }
}
.orb__legend {
  position: absolute;
  left: 50%;
  bottom: -6px;
  translate: -50% 0;
  display: flex;
  gap: 16px;
  font-size: 9.5px;
  color: var(--ink-faint);
  white-space: nowrap;
}
.orb__legend span { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 7px; height: 7px; border-radius: 50%; }
.dot--core { background: var(--neon-2); box-shadow: 0 0 10px var(--neon-2); }
.dot--agent { background: var(--neon); }
.dot--reg { background: var(--neon-3); }
@media (max-width: 520px) { .orb__legend { gap: 10px; font-size: 8.5px; } }
</style>
