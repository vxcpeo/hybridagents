<script setup>
import { ref } from 'vue'
import MastMark from './MastMark.vue'
import Glyph from './Glyph.vue'
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
    <div v-if="open" class="veil" @click.self="close">
      <section class="sheet" role="dialog" aria-modal="true" aria-label="Wallet">
        <header class="sheet-head">
          <MastMark :size="26" />
          <div>
            <strong>{{ step === 'pick' ? 'Connect a wallet' : 'Approve signature' }}</strong>
            <span>{{ BRAND.chain }} / {{ BRAND.cluster }} / {{ current || 'disconnected' }}</span>
          </div>
          <button class="sheet-close" aria-label="Close" @click="close"><Glyph kind="close" /></button>
        </header>

        <div v-if="step === 'pick'" class="sheet-body">
          <button v-for="w in WALLETS" :key="w.id" class="wallet" @click="pick(w)">
            <span class="wallet-glyph">{{ w.glyph }}</span>
            <span class="wallet-text">
              <strong>{{ w.id }}</strong>
              <em>{{ w.note }}</em>
            </span>
            <Glyph kind="dot" />
          </button>
          <p class="sheet-note">
            <Glyph kind="shield" />
            local preview: this screen never broadcasts a transaction
          </p>
        </div>

        <div v-else class="sheet-body">
          <div class="sign-card">
            <div class="sign-head">
              <span class="sign-mark"><Glyph kind="finger" /></span>
              <div>
                <strong>{{ chosen }}</strong>
                <p>Requesting a signature for a local <em>create_agent</em> instruction.</p>
              </div>
            </div>
            <dl class="sign-rows">
              <div><dt>program</dt><dd>{{ BRAND.programId.slice(0, 20) }}...</dd></div>
              <div><dt>fee payer</dt><dd>{{ current || 'local signer' }}</dd></div>
              <div><dt>network fee</dt><dd>0.000005 SOL</dd></div>
            </dl>
            <div class="sign-actions">
              <button class="press press-small" @click="approve"><Glyph kind="check" /> approve</button>
              <button class="press press-small press-quiet" @click="step = 'pick'"><Glyph kind="arrow" /> back</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>
