<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, Cpu, Gauge, Layers } from 'lucide-vue-next'
import { RECEIPTS } from '../brand'

const props = defineProps({
  blockHeight: { type: Number, default: 0 }
})

/* --- synthetic throughput series: deterministic, re-sampled on cue --------- */
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
  { id: 'a', icon: Layers, k: 'settled / 24h', v: '84,920', d: '+6.4% vs prior epoch' },
  { id: 'b', icon: Gauge, k: 'median settle', v: '412 ms', d: 'p95 1,870 ms' },
  { id: 'c', icon: Cpu, k: 'success rate', v: '98.1%', d: 'rewards only on success' },
  { id: 'd', icon: Activity, k: 'slots indexed', v: props.blockHeight.toLocaleString('en-US'), d: 'reorg-safe depth 32' }
])

const feed = computed(() => RECEIPTS.slice(0, 6))
</script>

<template>
  <section id="network" class="dispatch">
    <div class="dispatch-head">
      <div>
        <span class="dispatch-no">01 / network</span>
        <h2 class="dispatch-title">Load, lane by lane</h2>
      </div>
      <p class="dispatch-note">
        Throughput is read from indexed task events. The window switch re-samples the local
        preview series and the chart redraws on a short interval.
      </p>
    </div>

    <div class="dispatch-body">
      <div class="dispatch-main">
        <div class="measure">
          <div class="measure-head">
            <span class="label">task throughput</span>
            <div class="range">
              <button v-for="r in ['1h', '6h', '24h']" :key="r" :class="{ 'is-current': range === r }" @click="range = r; build()">{{ r }}</button>
            </div>
          </div>

          <div class="plot">
            <div class="plot-readout">
              <strong>{{ (load * 84).toLocaleString('en-US') }}</strong>
              <span>tasks / window / peak {{ peak.toLocaleString('en-US') }}</span>
            </div>
            <svg class="plot-svg" viewBox="0 0 100 104" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="plot-wash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#a97bff" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#670de5" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="g in 4" :key="g" x1="0" :y1="g * 24" x2="100" :y2="g * 24" stroke="#2b2930" stroke-width="0.3" />
              <path :d="area" fill="url(#plot-wash)" />
              <path :d="path" fill="none" stroke="#a97bff" stroke-width="0.9" vector-effect="non-scaling-stroke" />
            </svg>
            <div class="plot-axis">
              <span>-{{ range }}</span><span>now</span>
            </div>
          </div>
        </div>

        <div class="settle">
          <div class="settle-head">
            <span class="label">settlement tape</span>
            <span class="stamp"><span class="live-dot"></span>streaming</span>
          </div>
          <ol class="settle-rows">
            <li v-for="r in feed" :key="r.slot" class="settle-row">
              <span class="settle-slot">{{ r.slot.toLocaleString('en-US') }}</span>
              <span class="settle-task">{{ r.task }}</span>
              <span class="settle-hash">{{ r.hash }}</span>
              <span class="settle-ms">{{ r.ms }}ms</span>
              <span class="settle-reward" :class="{ 'is-slash': !r.ok }">
                {{ r.ok ? `+${r.reward}` : 'slashed' }}
              </span>
            </li>
          </ol>
        </div>
      </div>

      <div class="dispatch-margin">
        <table class="indicators">
          <tbody>
            <tr v-for="t in tiles" :key="t.k">
              <th scope="row">{{ t.k }}</th>
              <td>{{ t.v }}</td>
              <td class="indicators-note">{{ t.d }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
