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
  <section id="network" class="section">
    <div class="shell">
      <header class="section__head">
        <div>
          <span class="tag">01 / network</span>
          <h2 class="section__title">Load, lane by lane</h2>
        </div>
        <p class="section__note">
          Throughput is read from indexed task events. The window switch re-samples the local
          preview series and the chart redraws on a short interval.
        </p>
      </header>

      <div class="bento">
        <article class="panel bento__chart">
          <div class="panel__top">
            <span class="panel__label">task throughput</span>
            <div class="seg mono">
              <button v-for="r in ['1h', '6h', '24h']" :key="r" :class="{ on: range === r }" @click="range = r; build()">{{ r }}</button>
            </div>
          </div>
          <div class="chart">
            <div class="chart__readout">
              <strong class="tnum">{{ (load * 84).toLocaleString('en-US') }}</strong>
              <span class="mono">tasks / window / peak {{ peak.toLocaleString('en-US') }}</span>
            </div>
            <svg class="chart__svg" viewBox="0 0 100 104" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#22f5c8" stop-opacity="0.44" />
                  <stop offset="100%" stop-color="#22f5c8" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="g in 4" :key="g" x1="0" :y1="g * 24" x2="100" :y2="g * 24" stroke="rgba(120,180,255,0.10)" stroke-width="0.3" />
              <path :d="area" fill="url(#area-fill)" />
              <path :d="path" fill="none" stroke="#22f5c8" stroke-width="0.9" vector-effect="non-scaling-stroke" />
            </svg>
            <div class="chart__axis mono">
              <span>-{{ range }}</span><span>now</span>
            </div>
          </div>
        </article>

        <article v-for="t in tiles" :key="t.k" class="panel panel--flat tile" :class="`tile--${t.id}`">
          <component :is="t.icon" :size="15" class="tile__icon" />
          <span class="panel__label">{{ t.k }}</span>
          <strong class="tile__v tnum">{{ t.v }}</strong>
          <span class="tile__d mono">{{ t.d }}</span>
        </article>

        <article class="panel bento__tape">
          <div class="panel__top">
            <span class="panel__label">settlement tape</span>
            <span class="chip chip--good mono"><span class="beacon"></span>streaming</span>
          </div>
          <ul class="tape">
            <li v-for="r in feed" :key="r.slot" class="tape__row">
              <span class="tape__slot mono tnum">{{ r.slot.toLocaleString('en-US') }}</span>
              <span class="tape__task mono">{{ r.task }}</span>
              <span class="tape__hash mono">{{ r.hash }}</span>
              <span class="tape__ms mono tnum">{{ r.ms }}ms</span>
              <span class="tape__reward mono tnum" :class="{ bad: !r.ok }">
                {{ r.ok ? `+${r.reward}` : 'slashed' }}
              </span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}
.bento__chart { grid-column: 1 / span 8; grid-row: 1 / span 2; display: flex; flex-direction: column; }
.tile { display: grid; align-content: center; gap: 5px; padding: 15px 16px; align-self: start; }
.tile--a { grid-column: 9 / span 4; grid-row: 1; }
.tile--b { grid-column: 9 / span 4; grid-row: 2; }
.bento__tape { grid-column: 1 / span 8; grid-row: 3; align-self: start; }
.tile--c { grid-column: 9 / span 4; grid-row: 3; }
.tile--d { grid-column: 9 / span 4; grid-row: 4; }

.tile__icon { color: var(--neon); }
.tile__v { font-size: clamp(19px, 2vw, 26px); letter-spacing: -0.03em; line-height: 1.1; }
.tile__d { font-size: 9.5px; color: var(--ink-ghost); }

.seg { display: flex; gap: 2px; padding: 3px; border: 1px solid var(--line-soft); border-radius: 999px; }
.seg button {
  min-width: 34px;
  height: 22px;
  border-radius: 999px;
  font-size: 10px;
  color: var(--ink-faint);
  transition: background var(--fast), color var(--fast);
}
.seg button.on { background: rgba(34, 245, 200, 0.14); color: var(--neon); }

.chart { position: relative; padding: 18px 16px 12px; }
.chart__readout { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.chart__readout strong { font-size: clamp(22px, 2.4vw, 32px); letter-spacing: -0.035em; }
.chart__readout span { font-size: 10px; color: var(--ink-faint); }
.chart__svg { width: 100%; height: 172px; overflow: visible; }
.chart__axis { display: flex; justify-content: space-between; font-size: 9px; color: var(--ink-ghost); margin-top: 6px; }

.tape { padding: 6px 6px 10px; }
.tape__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 60px 52px;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 11px;
  color: var(--ink-dim);
  transition: background var(--fast);
}
.tape__row:nth-child(odd) { background: rgba(255, 255, 255, 0.018); }
.tape__row:hover { background: rgba(34, 245, 200, 0.06); }
.tape__slot { display: none; }
.tape__task { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tape__hash { display: none; }
.tape__ms { color: var(--ink-faint); font-size: 10px; text-align: right; }
.tape__reward { text-align: right; color: var(--neon-4); }
.tape__reward.bad { color: var(--danger); }

@media (max-width: 1080px) {
  .bento__chart,
  .bento__tape,
  .tile,
  .tile--a, .tile--b, .tile--c, .tile--d { grid-column: 1 / -1; grid-row: auto; }
  .tile { grid-column: span 6; }
  .tape__row { grid-template-columns: 104px minmax(0, 1.4fr) 84px 62px 76px; }
  .tape__slot, .tape__hash { display: block; }
}
@media (max-width: 700px) {
  .tile { grid-column: 1 / -1; }
  .tape__row { grid-template-columns: minmax(0, 1fr) 56px 64px; }
  .tape__slot, .tape__hash { display: none; }
}
</style>
