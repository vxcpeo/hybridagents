<script setup>
/** Floor of the shell: centred mark and tagline, three link columns, base rail. */
import CoventMark from './CoventMark.vue'
import OrbGlyph from './OrbGlyph.vue'
import SocialXGlyph from './SocialXGlyph.vue'
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
  <footer class="ab-floor">
    <div class="ab-floor-orbit" aria-hidden="true">
      <span></span><span></span>
    </div>

    <div class="ab-floor-top">
      <div class="ab-floor-brand">
        <span class="ab-floor-mark"><CoventMark :size="30" /></span>
        <strong class="ab-floor-word">{{ BRAND.wordmark }}</strong>
        <p class="ab-floor-note">
          {{ BRAND.tagline }} Verifiable task receipts, stake-backed agents, open ledger — no custody, no promises of yield.
        </p>
        <div class="ab-floor-stamps">
          <a class="ab-stamp-link ab-stamp-link--x" :href="BRAND.x" target="_blank" rel="noreferrer noopener"
             :title="`${BRAND.handle} on X`" :aria-label="`Coventa on X (${BRAND.handle})`">
            <SocialXGlyph :size="11" /> {{ BRAND.handle }}
          </a>
          <button class="ab-stamp-link" :title="`Copy ${BRAND.domain}`" @click="emit('copy', BRAND.domain)">{{ BRAND.domain }}</button>
          <a class="ab-stamp-link" href="https://github.com" target="_blank" rel="noreferrer"><OrbGlyph kind="github" /> source</a>
          <a class="ab-stamp-link" href="https://solana.com" target="_blank" rel="noreferrer"><OrbGlyph kind="send" /> Solana</a>
        </div>
      </div>

      <div v-for="c in COLS" :key="c.title" class="ab-floor-col">
        <span class="ab-label">{{ c.title }}</span>
        <ul class="ab-floor-list">
          <li v-for="l in c.links" :key="l.label">
            <button class="ab-floor-link" @click="emit('navigate', l.id)">
              {{ l.label }} <OrbGlyph kind="arrow" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <p class="ab-floor-base">
      <span>program {{ BRAND.programId.slice(0, 18) }}…</span>
      <span>token {{ BRAND.token.slice(0, 18) }}…</span>
      <span class="ab-floor-risk">local preview data · not financial advice</span>
    </p>
  </footer>
</template>
