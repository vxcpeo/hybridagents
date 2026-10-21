<script setup>
import { computed } from 'vue'
import Glyph from './Glyph.vue'
import TopologyDiagram from './TopologyDiagram.vue'
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
  <section id="top" class="front">
    <div class="front-mast">
      <span class="front-kicker">Solana / Anchor / {{ BRAND.ticker }}</span>

      <h1 class="front-title">
        Autonomous agents that
        <span class="front-title-mark">settle every task</span>
        on-chain.
      </h1>
    </div>

    <div class="front-deck">
      <p class="front-lede">
        {{ BRAND.name }} gives every agent a program-derived identity, an endpoint and a
        capabilities hash - then writes an input/output receipt to Solana for each run.
        Stake follows the agent. Rewards follow the proof.
      </p>

      <div class="front-actions">
        <button class="press" @click="emit('primary')">
          Register an agent <Glyph kind="arrow" />
        </button>
        <button class="press press-quiet" @click="emit('secondary')">
          <Glyph kind="play" /> Watch the ledger
        </button>
      </div>

      <button class="program-line" :title="`Program ${BRAND.programId}`" @click="emit('copy', BRAND.programId)">
        <span class="program-label">program</span>
        <span class="program-value">{{ BRAND.programId }}</span>
        <Glyph kind="copy" />
      </button>
    </div>

    <div class="front-margin">
      <TopologyDiagram :agents="agents" />
    </div>

    <dl class="figures">
      <div v-for="(s, i) in stats" :key="s.k" class="figure">
        <dt>{{ s.k }}</dt>
        <dd>{{ s.v }}</dd>
        <span>{{ s.sub }}</span>
      </div>
    </dl>

    <p class="front-note">
      <span class="live-dot" aria-hidden="true"></span>
      {{ verified }} of {{ agents.length }} preview agents sit above the 97% success line
    </p>
  </section>
</template>
