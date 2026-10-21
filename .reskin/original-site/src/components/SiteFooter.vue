<script setup>
import { ArrowUpRight, Github, Send } from 'lucide-vue-next'
import BrandMark from './BrandMark.vue'
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
  <footer class="foot">
    <div class="shell foot__grid">
      <div class="foot__brand">
        <div class="foot__mark"><BrandMark :size="38" spin /></div>
        <strong>{{ BRAND.wordmark }}</strong>
        <p>{{ BRAND.tagline }} Verifiable task receipts, stake-backed agents, open ledger — no custody, no promises of yield.</p>
        <div class="foot__social">
          <button class="chip" @click="emit('copy', BRAND.handle)">X · {{ BRAND.handle }}</button>
          <button class="chip" @click="emit('copy', BRAND.domain)">{{ BRAND.domain }}</button>
          <a class="chip" href="https://github.com" target="_blank" rel="noreferrer"><Github :size="11" /> source</a>
          <a class="chip" href="https://solana.com" target="_blank" rel="noreferrer"><Send :size="11" /> Solana</a>
        </div>
      </div>

      <nav v-for="c in COLS" :key="c.title" class="foot__col">
        <span class="panel__label">{{ c.title }}</span>
        <button v-for="l in c.links" :key="l.label" class="foot__link" @click="emit('navigate', l.id)">
          {{ l.label }} <ArrowUpRight :size="12" />
        </button>
      </nav>
    </div>

    <div class="shell foot__base mono">
      <span>program {{ BRAND.programId.slice(0, 18) }}…</span>
      <span>token {{ BRAND.token.slice(0, 18) }}…</span>
      <span class="foot__risk">local preview data · not financial advice</span>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  position: relative;
  z-index: 1;
  margin-top: clamp(30px, 6vw, 70px);
  border-top: 1px solid var(--line-soft);
  background: linear-gradient(180deg, rgba(4, 7, 15, 0), rgba(7, 12, 24, 0.85));
}
.foot__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 0.7fr));
  gap: 28px;
  padding-block: clamp(34px, 5vw, 62px);
}
.foot__brand { display: grid; gap: 12px; justify-items: start; max-width: 44ch; }
.foot__mark { color: var(--neon); }
.foot__brand strong { font-size: 17px; letter-spacing: 0.18em; }
.foot__brand p { color: var(--ink-dim); font-size: 12.5px; line-height: 1.65; }
.foot__social { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }

.foot__col { display: grid; gap: 11px; align-content: start; }
.foot__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-dim);
  text-align: left;
  transition: color var(--fast), gap var(--fast);
}
.foot__link:hover { color: var(--neon); gap: 9px; }

.foot__base {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  padding-block: 16px;
  border-top: 1px solid var(--line-soft);
  font-size: 9.5px;
  color: var(--ink-ghost);
  letter-spacing: 0.08em;
}
.foot__risk { margin-left: auto; color: var(--warn); }

@media (max-width: 900px) {
  .foot__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .foot__grid { grid-template-columns: minmax(0, 1fr); }
  .foot__risk { margin-left: 0; }
}
</style>
