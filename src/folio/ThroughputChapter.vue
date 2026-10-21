<script setup>
/**
 * Chapter one — the network as a printed measure: a throughput strip, the
 * settlement tape as a ruled register and the indicators as a fact sheet.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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
  <section id="network" class="foil-chapter">
    <p class="foil-chaptermark">01 / network</p>

    <div class="foil-chapterhead">
      <h2 class="foil-chaptertitle">Load, lane by lane</h2>
      <p class="foil-chapternote">
        Throughput is read from indexed task events. The window switch re-samples the local
        preview series and the chart redraws on a short interval.
      </p>
    </div>

    <div class="foil-chapterbody">
      <div class="foil-network">
        <div class="foil-measure">
          <div class="foil-measurehead">
            <span class="foil-label">task throughput</span>
            <div class="foil-range">
              <button v-for="r in ['1h', '6h', '24h']" :key="r" class="foil-rangebtn"
                      :class="{ 'is-on': range === r }" @click="range = r; build()">{{ r }}</button>
            </div>
          </div>

          <div class="foil-plot">
            <div class="foil-plotreadout">
              <strong>{{ (load * 84).toLocaleString('en-US') }}</strong>
              <span>tasks / window / peak {{ peak.toLocaleString('en-US') }}</span>
            </div>
            <svg class="foil-plotsvg" viewBox="0 0 100 104" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="foil-wash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0c5681" stop-opacity="0.22" />
                  <stop offset="100%" stop-color="#0c5681" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="g in 4" :key="g" x1="0" :y1="g * 24" x2="100" :y2="g * 24" stroke="#d6cebb" stroke-width="0.3" />
              <path :d="area" fill="url(#foil-wash)" />
              <path :d="path" fill="none" stroke="#0c5681" stroke-width="0.9" vector-effect="non-scaling-stroke" />
            </svg>
            <div class="foil-plotaxis">
              <span>-{{ range }}</span><span>now</span>
            </div>
          </div>
        </div>

        <div class="foil-tape">
          <div class="foil-tapehead">
            <span class="foil-label">settlement tape</span>
            <span class="foil-stamp"><span class="foil-livedot"></span>streaming</span>
          </div>
          <ol class="foil-taperows">
            <li v-for="r in feed" :key="r.slot" class="foil-taperow">
              <span class="foil-slotcell">{{ r.slot.toLocaleString('en-US') }}</span>
              <span class="foil-taskcell">{{ r.task }}</span>
              <span class="foil-hashcell">{{ r.hash }}</span>
              <span class="foil-mscell">{{ r.ms }}ms</span>
              <span class="foil-rewardcell" :class="{ 'is-lost': !r.ok }">
                {{ r.ok ? `+${r.reward}` : 'slashed' }}
              </span>
            </li>
          </ol>
        </div>
      </div>

      <dl class="foil-indicators">
        <div v-for="t in tiles" :key="t.k" class="foil-indicator">
          <dt class="foil-indicatorkey">{{ t.k }}</dt>
          <dd class="foil-indicatorvalue">{{ t.v }}</dd>
          <span class="foil-indicatordetail">{{ t.d }}</span>
        </div>
      </dl>
    </div>
  </section>
</template>
