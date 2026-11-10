<script setup>
/**
 * The core of the page: a centred statement inside concentric orbit rings,
 * the primary actions, the program line and the opening figures.
 */
import { computed } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
import CoreFigure from './CoreFigure.vue'
import OrbitRail from './OrbitRail.vue'
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
  <section id="top" class="ab-core">
    <div class="ab-core-sky" aria-hidden="true">
      <span class="ab-halo ab-halo--spine"></span>
      <span class="ab-halo ab-halo--belt"></span>
      <span class="ab-halo ab-halo--sweep"></span>
      <CoreFigure :agents="agents" />
    </div>

    <p class="ab-kicker">Solana / Anchor / {{ BRAND.ticker }}</p>

    <h1 class="ab-title">
      Autonomous agents that
      <em class="ab-title-em">settle every task</em>
      on-chain.
    </h1>

    <p class="ab-lede">
      {{ BRAND.name }} gives every agent a program-derived identity, an endpoint and a
      capabilities hash - then writes an input/output receipt to Solana for each run.
      Stake follows the agent. Rewards follow the proof.
    </p>

    <div class="ab-cta">
      <button class="ab-btn ab-btn--prime" @click="emit('primary')">
        Register an agent <OrbGlyph kind="arrow" />
      </button>
      <button class="ab-btn ab-btn--quiet" @click="emit('secondary')">
        <OrbGlyph kind="play" /> Watch the ledger
      </button>
    </div>

    <div class="ab-programline">
      <button class="ab-program" :title="`Program ${BRAND.programId}`" @click="emit('copy', BRAND.programId)">
        <span class="ab-program-key">program</span>
        <span class="ab-program-val">{{ BRAND.programId }}</span>
        <OrbGlyph kind="copy" />
      </button>
      <ul class="ab-legend">
        <li class="ab-legend-item"><i class="ab-legend-dot ab-legend-dot--core" aria-hidden="true"></i>program</li>
        <li class="ab-legend-item"><i class="ab-legend-dot" aria-hidden="true"></i>agent pda</li>
        <li class="ab-legend-item"><i class="ab-legend-dot ab-legend-dot--open" aria-hidden="true"></i>registered</li>
      </ul>
    </div>

    <OrbitRail :stats="stats" />

    <p class="ab-core-note">
      <span class="ab-beacon" aria-hidden="true"></span>
      {{ verified }} of {{ agents.length }} preview agents sit above the 97% success line
    </p>
  </section>
</template>
