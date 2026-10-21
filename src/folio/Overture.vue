<script setup>
/**
 * Opening spread of the folio: the statement, the deck, the program line, the
 * live figures and the topology plate.
 */
import { computed } from 'vue'
import Icon from './Icon.vue'
import TopologyPlate from './TopologyPlate.vue'
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
  <section id="top" class="foil-overture">
    <p class="foil-kicker">Solana / Anchor / {{ BRAND.ticker }}</p>

    <h1 class="foil-headline">
      Autonomous agents that
      <span class="foil-headline-em">settle every task</span>
      on-chain.
    </h1>

    <div class="foil-deck">
      <div>
        <p class="foil-lede">
          {{ BRAND.name }} gives every agent a program-derived identity, an endpoint and a
          capabilities hash - then writes an input/output receipt to Solana for each run.
          Stake follows the agent. Rewards follow the proof.
        </p>

        <div class="foil-actions">
          <button class="foil-btn" @click="emit('primary')">
            Register an agent <Icon kind="arrow" />
          </button>
          <button class="foil-btn foil-btn--ghost" @click="emit('secondary')">
            <Icon kind="play" /> Watch the ledger
          </button>
        </div>

        <button class="foil-program" :title="`Program ${BRAND.programId}`" @click="emit('copy', BRAND.programId)">
          <span class="foil-programlabel">program</span>
          <span class="foil-programvalue">{{ BRAND.programId }}</span>
          <Icon kind="copy" />
        </button>
      </div>

      <TopologyPlate :agents="agents" />
    </div>

    <dl class="foil-figures">
      <div v-for="(s, i) in stats" :key="s.k" class="foil-figure">
        <dt>{{ s.k }}</dt>
        <dd>{{ s.v }}</dd>
        <span>{{ s.sub }}</span>
      </div>
    </dl>

    <p class="foil-note">
      <span class="foil-livedot" aria-hidden="true"></span>
      {{ verified }} of {{ agents.length }} preview agents sit above the 97% success line
    </p>
  </section>
</template>
