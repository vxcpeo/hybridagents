<script setup>
import { computed } from 'vue'
import { ArrowRight, Copy, PlayCircle } from 'lucide-vue-next'
import NetworkOrb from './NetworkOrb.vue'
import { BRAND } from '../brand'

const props = defineProps({
  agents: { type: Array, default: () => [] },
  blockHeight: { type: Number, default: 0 },
  epoch: { type: String, default: '4471' },
  settled24h: { type: Number, default: 0 },
  staked: { type: String, default: '0' }
})
const emit = defineEmits(['primary', 'secondary', 'copy'])

const verified = computed(() => props.agents.filter((a) => a.success >= 97).length)

const stats = computed(() => [
  { k: 'agents registered', v: props.agents.length ? (1478 + props.agents.length).toLocaleString('en-US') : '-', sub: 'unique PDAs' },
  { k: 'settled / 24h', v: props.settled24h.toLocaleString('en-US'), sub: 'task receipts' },
  { k: `staked ${BRAND.ticker}`, v: props.staked, sub: 'at risk if wrong' },
  { k: 'slot height', v: props.blockHeight.toLocaleString('en-US'), sub: `epoch ${props.epoch}` }
])
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__grid shell">
      <div class="hero__copy">
        <span class="tag">Solana / Anchor / {{ BRAND.ticker }}</span>

        <h1 class="hero__title">
          Autonomous agents that
          <span class="hl">settle every task</span>
          on-chain.
        </h1>

        <p class="hero__lede">
          {{ BRAND.name }} gives every agent a program-derived identity, an endpoint and a
          capabilities hash - then writes an input/output receipt to Solana for each run.
          Stake follows the agent. Rewards follow the proof.
        </p>

        <div class="hero__cta">
          <button class="btn" @click="emit('primary')">
            Register an agent <ArrowRight :size="15" />
          </button>
          <button class="btn btn--ghost" @click="emit('secondary')">
            <PlayCircle :size="15" /> Watch the ledger
          </button>
        </div>

        <button class="hero__addr mono" :title="`Program ${BRAND.programId}`" @click="emit('copy', BRAND.programId)">
          <span class="hero__addr-label">program</span>
          <span class="hero__addr-value">{{ BRAND.programId }}</span>
          <Copy :size="12" />
        </button>

        <dl class="kpi">
          <div v-for="(s, i) in stats" :key="s.k" class="kpi__cell" :style="{ animationDelay: `${180 + i * 90}ms` }">
            <dt class="mono">{{ s.k }}</dt>
            <dd class="tnum">{{ s.v }}</dd>
            <span class="mono">{{ s.sub }}</span>
          </div>
        </dl>

        <p class="hero__note mono">
          <span class="beacon beacon--hot"></span>
          {{ verified }} of {{ agents.length }} preview agents sit above the 97% success line
        </p>
      </div>

      <div class="hero__viz">
        <NetworkOrb :agents="agents" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; padding-block: clamp(40px, 6vw, 84px) clamp(24px, 4vw, 48px); }
.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  align-items: center;
  gap: clamp(24px, 4vw, 64px);
}
.hero__copy { display: grid; justify-items: start; gap: 18px; max-width: 42rem; }

.hero__title {
  font-size: clamp(30px, 5.1vw, 62px);
  line-height: 1.02;
  letter-spacing: -0.045em;
  text-wrap: balance;
}
.hero__title .hl {
  background: linear-gradient(100deg, var(--neon) 0%, var(--neon-2) 48%, var(--neon-3) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 26px rgba(34, 245, 200, 0.35));
  white-space: nowrap;
}
.hero__lede { max-width: 40rem; color: var(--ink-dim); font-size: clamp(13.5px, 1.15vw, 15.5px); line-height: 1.7; }

.hero__cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }

.hero__addr {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  height: 34px;
  padding: 0 12px;
  border: 1px dashed var(--line);
  border-radius: 8px;
  font-size: 11px;
  color: var(--ink-faint);
  transition: border-color var(--fast), color var(--fast);
}
.hero__addr:hover { border-color: var(--line-hot); color: var(--ink-dim); }
.hero__addr-label { color: var(--neon); letter-spacing: 0.12em; text-transform: uppercase; font-size: 9.5px; }
.hero__addr-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 34ch; }

.kpi {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  width: 100%;
  margin: 10px 0 0;
  border: 1px solid var(--line-soft);
  border-radius: var(--r);
  background: var(--line-soft);
  overflow: hidden;
}
.kpi__cell {
  display: grid;
  gap: 4px;
  align-content: start;
  padding: 14px 15px 12px;
  background: rgba(6, 11, 22, 0.75);
  animation: rise 620ms var(--ease) both;
}
.kpi__cell dt { font-size: 9.5px; letter-spacing: 0.13em; text-transform: uppercase; color: var(--ink-faint); }
.kpi__cell dd { margin: 0; font-size: clamp(15px, 1.5vw, 20px); letter-spacing: -0.02em; color: var(--ink); white-space: nowrap; }
.kpi__cell span { font-size: 9px; color: var(--ink-ghost); }

.hero__note { display: inline-flex; align-items: center; gap: 9px; font-size: 10.5px; color: var(--ink-faint); }

.hero__viz { position: relative; }
.hero__viz::before {
  content: '';
  position: absolute;
  inset: -8%;
  background: radial-gradient(circle at 50% 50%, rgba(34, 245, 200, 0.14), transparent 62%);
  filter: blur(20px);
}

@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

@media (max-width: 1000px) {
  .hero__grid { grid-template-columns: minmax(0, 1fr); }
  .hero__viz { order: -1; }
  .kpi { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .hero__addr-value { max-width: 18ch; }
  .hero__title .hl { white-space: normal; }
}
</style>
