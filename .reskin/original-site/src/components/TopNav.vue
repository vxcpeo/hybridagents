<script setup>
import { computed, ref } from 'vue'
import { Activity, Menu, Radio, Wallet, X } from 'lucide-vue-next'
import BrandMark from './BrandMark.vue'
import { BRAND, NAV } from '../brand'

const props = defineProps({
  active: { type: String, default: 'network' },
  wallet: { type: String, default: '' },
  online: { type: Number, default: 0 },
  blockHeight: { type: Number, default: 0 }
})
const emit = defineEmits(['navigate', 'connect'])

const open = ref(false)
const heightText = computed(() => props.blockHeight.toLocaleString('en-US'))
const slotText = computed(() => (291884000 + props.blockHeight).toLocaleString('en-US'))

function go(id) {
  open.value = false
  emit('navigate', id)
}
</script>

<template>
  <header class="bar">
    <div class="bar__inner shell">
      <button class="brand" @click="go('top')" aria-label="Back to top">
        <BrandMark :size="30" />
        <span class="brand__text">
          <strong>{{ BRAND.wordmark }}</strong>
          <em class="mono">{{ BRAND.domain }}</em>
        </span>
      </button>

      <nav class="nav" aria-label="Sections">
        <button v-for="item in NAV" :key="item.id" class="nav__item"
                :class="{ 'is-on': active === item.id }" :title="item.hint" @click="go(item.id)">
          {{ item.label }}
        </button>
      </nav>

      <div class="bar__right">
        <div class="chain mono" :title="`Program ${BRAND.programId}`">
          <span class="beacon beacon--hot"></span>
          <span class="chain__net">{{ BRAND.chain }} / {{ BRAND.cluster }}</span>
          <span class="chain__slot">#{{ slotText }}</span>
        </div>
        <button class="btn btn--sm btn--ghost" @click="emit('connect')">
          <Wallet :size="13" />
          <span>{{ wallet || 'Connect' }}</span>
        </button>
        <button class="hamb" :aria-expanded="open" aria-label="Toggle menu" @click="open = !open">
          <X v-if="open" :size="17" />
          <Menu v-else :size="17" />
        </button>
      </div>
    </div>

    <div class="ticker">
      <div class="ticker__inner shell">
        <span class="ticker__cell mono"><Radio :size="12" /> height {{ heightText }}</span>
        <span class="ticker__cell mono"><Activity :size="12" /> {{ online.toLocaleString('en-US') }} agents online</span>
        <span class="ticker__cell mono">epoch 4471</span>
        <span class="ticker__cell mono">median settle 412 ms</span>
        <span class="ticker__cell mono ticker__ok">all systems nominal</span>
      </div>
    </div>

    <transition name="drop">
      <div v-if="open" class="drawer">
        <button v-for="item in NAV" :key="item.id" class="drawer__row" @click="go(item.id)">
          <strong>{{ item.label }}</strong><span class="mono">{{ item.hint }}</span>
        </button>
        <button class="btn btn--sm" @click="emit('connect'); open = false">
          <Wallet :size="13" /> {{ wallet || 'Connect wallet' }}
        </button>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(4, 7, 15, 0.72);
  border-bottom: 1px solid var(--line-soft);
  backdrop-filter: blur(16px) saturate(140%);
}
.bar__inner {
  display: flex;
  align-items: center;
  gap: 18px;
  height: 62px;
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand__text { display: grid; line-height: 1.05; text-align: left; }
.brand__text strong { font-size: 15px; letter-spacing: 0.14em; }
.brand__text em { font-size: 9px; font-style: normal; color: var(--ink-faint); letter-spacing: 0.1em; }

.nav { display: flex; align-items: center; gap: 2px; margin-left: auto; }
.nav__item {
  position: relative;
  height: 32px;
  padding: 0 13px;
  border-radius: 999px;
  font: 400 12px/1 var(--mono);
  letter-spacing: 0.04em;
  color: var(--ink-dim);
  transition: color var(--fast), background var(--fast);
}
.nav__item:hover { color: var(--ink); background: rgba(255, 255, 255, 0.045); }
.nav__item.is-on { color: var(--neon); background: rgba(34, 245, 200, 0.09); }
.nav__item.is-on::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12px;
  translate: -50% 0;
  width: 22px;
  height: 2px;
  background: var(--neon);
  box-shadow: 0 0 12px var(--neon);
}

.bar__right { display: flex; align-items: center; gap: 10px; margin-left: 8px; }
.chain {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  font-size: 10.5px;
  color: var(--ink-dim);
  white-space: nowrap;
}
.chain__slot { color: var(--ink-faint); }

.hamb { display: none; width: 34px; height: 34px; place-items: center; border: 1px solid var(--line); border-radius: 8px; color: var(--ink-dim); }

.ticker {
  border-top: 1px solid var(--line-soft);
  background: linear-gradient(90deg, rgba(34, 245, 200, 0.05), rgba(124, 92, 255, 0.05));
}
.ticker__inner {
  display: flex;
  align-items: center;
  gap: 26px;
  height: 28px;
  overflow: hidden;
}
.ticker__cell { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; color: var(--ink-faint); white-space: nowrap; }
.ticker__ok { color: var(--neon-4); margin-left: auto; }

.drawer {
  display: grid;
  gap: 4px;
  padding: 12px var(--gutter) 18px;
  border-top: 1px solid var(--line-soft);
  background: rgba(7, 12, 24, 0.97);
}
.drawer__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 2px;
  border-bottom: 1px solid var(--line-soft);
  text-align: left;
}
.drawer__row span { font-size: 10px; color: var(--ink-faint); }
.drawer .btn { margin-top: 10px; }

.drop-enter-active, .drop-leave-active { transition: opacity var(--fast), transform var(--fast); }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 1080px) {
  .chain__net { display: none; }
}
@media (max-width: 900px) {
  .nav { display: none; }
  .hamb { display: grid; }
  .brand__text em { display: none; }
}
@media (max-width: 620px) {
  .chain { display: none; }
  .ticker__inner { gap: 16px; }
  .ticker__inner > .ticker__cell:nth-child(4) { display: none; }
}
@media (max-width: 470px) {
  .ticker__inner > .ticker__cell:nth-child(3) { display: none; }
  .ticker__ok { margin-left: auto; }
}
</style>
