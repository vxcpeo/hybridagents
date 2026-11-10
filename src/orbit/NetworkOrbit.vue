<script setup>
/**
 * Network chapter: the throughput measure and the settlement tape sit side by
 * side as two glass instruments, with the indicator set on a metric rail below.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
import { RECEIPTS } from '../brand'

const props = defineProps({
  blockHeight: { type: Number, default: 0 }
})

const series = ref([])
const range = ref('1h')
const POINTS = 48

function build() {
  const trend = range.value === '1h' ? 0 : range.value === '6h' ? 0.18 : 0.32
  series.value = Array.from({ length: POINTS }, (_, i) => {
    const wave = Math.sin(i / 5.2) * 12 + Math.sin(i / 2.1) * 5
    const spike = i > POINTS - 9 ? (i - (POINTS - 9)) * 5.4 : 0
    return Math.max(8, Math.min(96, 40 + wave + i * trend + spike))
  })
}

let timer = 0
onMounted(() => {
  build()
  timer = window.setInterval(build, 4200)
})
onBeforeUnmount(() => window.clearInterval(timer))

const path = computed(() => {
  const pts = series.value
  if (!pts.length) return ''
  const step = 100 / (POINTS - 1)
  return pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(2)},${(104 - v).toFixed(2)}`).join(' ')
})
const area = computed(() => (path.value ? `${path.value} L100,104 L0,104 Z` : ''))

const peak = computed(() => (series.value.length ? Math.round(Math.max(...series.value) * 84) : 0))
const load = computed(() => (series.value.length ? Math.round(series.value.reduce((a, b) => a + b, 0) / series.value.length) : 0))

const tiles = computed(() => [
  { id: 'a', k: 'settled / 24h', v: '84,920', d: '+6.4% vs prior epoch' },
  { id: 'b', k: 'median settle', v: '412 ms', d: 'p95 1,870 ms' },
  { id: 'c', k: 'success rate', v: '98.1%', d: 'rewards only on success' },
  { id: 'd', k: 'slots indexed', v: props.blockHeight.toLocaleString('en-US'), d: 'reorg-safe depth 32' }
])

const feed = computed(() => RECEIPTS.slice(0, 6))
</script>

<template>
  <section id="network" class="ab-chapter">
    <header class="ab-chapter-head">
      <p class="ab-badge"><span class="ab-badge-arc" aria-hidden="true"></span>01 / network</p>
      <div class="ab-chapter-copy">
        <h2 class="ab-chapter-title">Load, lane by lane</h2>
        <p class="ab-chapter-note">
          Throughput is read from indexed task events. The window switch re-samples the local
          preview series and the chart redraws on a short interval.
        </p>
      </div>
    </header>

    <div class="ab-instruments">
      <div class="ab-panel ab-panel--chart">
        <div class="ab-panel-head">
          <span class="ab-label">task throughput</span>
          <div class="ab-switch">
            <button v-for="r in ['1h', '6h', '24h']" :key="r" class="ab-switch-btn"
                    :class="{ 'ab-switch-btn--on': range === r }" @click="range = r; build()">{{ r }}</button>
          </div>
        </div>

        <div class="ab-plot">
          <p class="ab-plot-read">
            <strong class="ab-plot-num">{{ (load * 84).toLocaleString('en-US') }}</strong>
            <span class="ab-plot-cap">tasks / window / peak {{ peak.toLocaleString('en-US') }}</span>
          </p>

          <svg class="ab-plot-svg" viewBox="0 0 100 104" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="ab-plot-wash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ff2f2f" stop-opacity="0.34" />
                <stop offset="62%" stop-color="#ff00ff" stop-opacity="0.10" />
                <stop offset="100%" stop-color="#ff2f2f" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line v-for="g in 4" :key="g" x1="0" :y1="g * 24" x2="100" :y2="g * 24"
                  stroke="#22303d" stroke-width="0.4" vector-effect="non-scaling-stroke" />
            <path :d="area" fill="url(#ab-plot-wash)" />
            <path :d="path" fill="none" stroke="#ff4d4d" stroke-width="1.4"
                  vector-effect="non-scaling-stroke" />
          </svg>

          <p class="ab-plot-axis">
            <span>-{{ range }}</span><span>now</span>
          </p>
        </div>
      </div>

      <div class="ab-panel ab-panel--tape">
        <div class="ab-panel-head">
          <span class="ab-label">settlement tape</span>
          <span class="ab-stamp"><i class="ab-beacon" aria-hidden="true"></i>streaming</span>
        </div>
        <ol class="ab-tape">
          <li v-for="r in feed" :key="r.slot" class="ab-tape-row">
            <span class="ab-tape-slot">{{ r.slot.toLocaleString('en-US') }}</span>
            <span class="ab-tape-task">{{ r.task }}</span>
            <span class="ab-tape-hash">{{ r.hash }}</span>
            <span class="ab-tape-ms">{{ r.ms }}ms</span>
            <span class="ab-tape-rew" :class="{ 'ab-tape-rew--down': !r.ok }">
              {{ r.ok ? `+${r.reward}` : 'slashed' }}
            </span>
          </li>
        </ol>
      </div>
    </div>

    <dl class="ab-metrics">
      <div v-for="t in tiles" :key="t.k" class="ab-metric">
        <dt class="ab-metric-key">{{ t.k }}</dt>
        <dd class="ab-metric-val">{{ t.v }}</dd>
        <span class="ab-metric-detail">{{ t.d }}</span>
      </div>
    </dl>
  </section>
</template>
