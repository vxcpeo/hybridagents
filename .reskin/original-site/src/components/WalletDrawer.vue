<script setup>
import { ref } from 'vue'
import { ArrowLeft, Check, KeyRound, Radio, ShieldCheck, X } from 'lucide-vue-next'
import BrandMark from './BrandMark.vue'
import { BRAND } from '../brand'

defineProps({
  open: { type: Boolean, default: false },
  current: { type: String, default: '' }
})
const emit = defineEmits(['close', 'pick'])

const WALLETS = [
  { id: 'Phantom', glyph: 'P', tone: 'w1', note: 'browser extension' },
  { id: 'Solflare', glyph: 'S', tone: 'w2', note: 'extension + mobile' },
  { id: 'Backpack', glyph: 'B', tone: 'w3', note: 'xNFT enabled' },
  { id: 'Local keypair', glyph: 'K', tone: 'w4', note: '~/.config/solana/id.json' }
]

const step = ref('pick')
const chosen = ref(null)

function pick(w) {
  chosen.value = w.id
  step.value = 'sign'
}

function approve() {
  emit('pick', chosen.value)
  step.value = 'pick'
  chosen.value = null
}

function close() {
  step.value = 'pick'
  chosen.value = null
  emit('close')
}
</script>

<template>
  <transition name="drawer">
    <div v-if="open" class="scrim" @click.self="close">
      <aside class="sheet" role="dialog" aria-modal="true" aria-label="Wallet">
        <header class="sheet__head">
          <BrandMark :size="26" />
          <div>
            <strong>{{ step === 'pick' ? 'Connect a wallet' : 'Approve signature' }}</strong>
            <span class="mono">{{ BRAND.chain }} / {{ BRAND.cluster }} / {{ current || 'disconnected' }}</span>
          </div>
          <button class="icon" aria-label="Close" @click="close"><X :size="16" /></button>
        </header>

        <div v-if="step === 'pick'" class="sheet__body">
          <button v-for="w in WALLETS" :key="w.id" class="wallet" @click="pick(w)">
            <span class="wallet__glyph" :class="w.tone">{{ w.glyph }}</span>
            <span class="wallet__txt">
              <strong>{{ w.id }}</strong>
              <em class="mono">{{ w.note }}</em>
            </span>
            <Radio :size="14" />
          </button>
          <p class="sheet__note mono">
            <ShieldCheck :size="12" />
            local preview: this screen never broadcasts a transaction
          </p>
        </div>

        <div v-else class="sheet__body">
          <div class="sign">
            <span class="sign__ring"><KeyRound :size="20" /></span>
            <div>
              <strong class="mono">{{ chosen }}</strong>
              <p>Requesting a signature for a local <em class="mono">create_agent</em> instruction.</p>
            </div>
          </div>
          <dl class="sign__rows mono">
            <div><dt>program</dt><dd>{{ BRAND.programId.slice(0, 20) }}...</dd></div>
            <div><dt>fee payer</dt><dd>{{ current || 'local signer' }}</dd></div>
            <div><dt>network fee</dt><dd>0.000005 SOL</dd></div>
          </dl>
          <div class="sign__actions">
            <button class="btn" @click="approve"><Check :size="14" /> approve</button>
            <button class="btn btn--ghost" @click="step = 'pick'"><ArrowLeft :size="13" /> back</button>
          </div>
        </div>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: flex-end;
  background: rgba(2, 4, 10, 0.62);
  backdrop-filter: blur(4px);
}
.sheet {
  width: min(420px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(14, 23, 41, 0.98), rgba(4, 7, 15, 0.99));
  box-shadow: -40px 0 90px -40px #000;
}
.sheet__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px 16px;
  border-bottom: 1px solid var(--line-soft);
}
.sheet__head div { display: grid; gap: 3px; }
.sheet__head strong { font-size: 14px; }
.sheet__head span { font-size: 10px; color: var(--ink-faint); }
.icon { margin-left: auto; display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid var(--line-soft); border-radius: 8px; color: var(--ink-faint); }
.icon:hover { color: var(--neon); border-color: var(--line-hot); }

.sheet__body { padding: 16px 18px 22px; display: grid; gap: 10px; overflow-y: auto; }

.wallet {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 13px;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  text-align: left;
  transition: border-color var(--fast), transform var(--fast), background var(--fast);
}
.wallet:hover { border-color: var(--line-hot); transform: translateX(-2px); background: rgba(34, 245, 200, 0.05); }
.wallet svg { margin-left: auto; color: var(--ink-ghost); transform: rotate(-90deg); }
.wallet__glyph { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; font: 700 14px/1 var(--mono); color: #05070e; }
.w1 { background: linear-gradient(140deg, #c3a6ff, #8d6bff); }
.w2 { background: linear-gradient(140deg, #ffb98f, #ff7a45); }
.w3 { background: linear-gradient(140deg, #9fe6ff, #38b6ff); }
.w4 { background: linear-gradient(140deg, #b6ffe6, #22f5c8); }
.wallet__txt { display: grid; gap: 3px; }
.wallet__txt strong { font-size: 13px; }
.wallet__txt em { font-size: 10px; font-style: normal; color: var(--ink-faint); }

.sheet__note { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: 10px; color: var(--ink-ghost); }
.sheet__note svg { color: var(--neon); }

.sign { display: flex; gap: 13px; align-items: flex-start; padding: 14px; border: 1px solid var(--line); border-radius: 12px; background: rgba(34, 245, 200, 0.05); }
.sign__ring { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line-hot); color: var(--neon); box-shadow: var(--glow-soft); flex: 0 0 auto; }
.sign strong { font-size: 12.5px; }
.sign p { margin-top: 5px; font-size: 11.5px; color: var(--ink-dim); line-height: 1.55; }

.sign__rows { display: grid; gap: 9px; margin: 0; padding: 13px; border: 1px solid var(--line-soft); border-radius: 10px; }
.sign__rows div { display: flex; justify-content: space-between; gap: 12px; }
.sign__rows dt { font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-ghost); }
.sign__rows dd { margin: 0; font-size: 10.5px; color: var(--ink-dim); }
.sign__actions { display: flex; gap: 9px; margin-top: 4px; }
.sign__actions .btn:first-child { flex: 1; }

.drawer-enter-active, .drawer-leave-active { transition: opacity 200ms var(--ease); }
.drawer-enter-active .sheet, .drawer-leave-active .sheet { transition: transform 260ms var(--ease); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .sheet, .drawer-leave-to .sheet { transform: translateX(24px); }
</style>
