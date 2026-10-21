<script setup>
import MastMark from './MastMark.vue'
import Glyph from './Glyph.vue'
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
  <footer class="colophon">
    <div class="colophon-top">
      <div class="colophon-mast">
        <span class="colophon-seal"><MastMark :size="44" /></span>
        <strong>{{ BRAND.wordmark }}</strong>
        <p>{{ BRAND.tagline }} Verifiable task receipts, stake-backed agents, open ledger — no custody, no promises of yield.</p>
        <div class="colophon-links">
          <button class="stamp" @click="emit('copy', BRAND.handle)">X · {{ BRAND.handle }}</button>
          <button class="stamp" @click="emit('copy', BRAND.domain)">{{ BRAND.domain }}</button>
          <a class="stamp" href="https://github.com" target="_blank" rel="noreferrer"><Glyph kind="github" /> source</a>
          <a class="stamp" href="https://solana.com" target="_blank" rel="noreferrer"><Glyph kind="send" /> Solana</a>
        </div>
      </div>

      <div v-for="c in COLS" :key="c.title" class="colophon-col">
        <span class="label">{{ c.title }}</span>
        <ul class="colophon-list">
          <li v-for="l in c.links" :key="l.label">
            <button class="colophon-link" @click="emit('navigate', l.id)">
              {{ l.label }} <Glyph kind="arrow" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <p class="colophon-base">
      <span>program {{ BRAND.programId.slice(0, 18) }}…</span>
      <span>token {{ BRAND.token.slice(0, 18) }}…</span>
      <span class="colophon-risk">local preview data · not financial advice</span>
    </p>
  </footer>
</template>
