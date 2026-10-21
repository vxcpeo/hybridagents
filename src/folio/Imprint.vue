<script setup>
/** Imprint of the folio: the mast stamp, the three link columns and the base rule. */
import SealMark from './SealMark.vue'
import Icon from './Icon.vue'
import { BRAND } from '../brand'

const COLS = [
  {
    title: 'Network',
    links: [
      { label: 'Topology', id: 'network' },
      { label: 'Registry', id: 'registry' },
      { label: 'Ledger', id: 'ledger' },
      { label: 'Console', id: 'console' }
    ]
  },
  {
    title: 'Economy',
    links: [
      { label: 'Staking vault', id: 'vault' },
      { label: 'Council', id: 'vault' },
      { label: 'Reward schedule', id: 'vault' }
    ]
  },
  {
    title: 'Build',
    links: [
      { label: 'Anchor program', id: 'network' },
      { label: 'Receipt schema', id: 'ledger' },
      { label: 'Run a validator', id: 'console' }
    ]
  }
]
const emit = defineEmits(['navigate', 'copy'])
</script>

<template>
  <div class="foil-imprint" role="contentinfo">
    <div class="foil-imprinttop">
      <div class="foil-imprintbrand">
        <span class="foil-imprintseal"><SealMark :size="30" /></span>
        <strong class="foil-imprintword">{{ BRAND.wordmark }}</strong>
        <p class="foil-imprintnote">
          {{ BRAND.tagline }} Verifiable task receipts, stake-backed agents, open ledger — no custody, no promises of yield.
        </p>
        <div class="foil-imprintstamps">
          <button class="foil-imprintstamp" @click="emit('copy', BRAND.handle)">X · {{ BRAND.handle }}</button>
          <button class="foil-imprintstamp" @click="emit('copy', BRAND.domain)">{{ BRAND.domain }}</button>
          <a class="foil-imprintstamp" href="https://github.com" target="_blank" rel="noreferrer"><Icon kind="github" /> source</a>
          <a class="foil-imprintstamp" href="https://solana.com" target="_blank" rel="noreferrer"><Icon kind="send" /> Solana</a>
        </div>
      </div>

      <div v-for="c in COLS" :key="c.title" class="foil-imprintcol">
        <span class="foil-label">{{ c.title }}</span>
        <ul class="foil-imprintlist">
          <li v-for="l in c.links" :key="l.label">
            <button class="foil-imprintlink" @click="emit('navigate', l.id)">
              {{ l.label }} <Icon kind="arrow" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <p class="foil-imprintbase">
      <span>program {{ BRAND.programId.slice(0, 18) }}…</span>
      <span>token {{ BRAND.token.slice(0, 18) }}…</span>
      <span class="is-risk">local preview data · not financial advice</span>
    </p>
  </div>
</template>
