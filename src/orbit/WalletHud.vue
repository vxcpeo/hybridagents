<script setup>
/** Wallet docket: pick a signer, review the instruction, approve. */
import { ref } from 'vue'
import CoventMark from './CoventMark.vue'
import OrbGlyph from './OrbGlyph.vue'
import { BRAND } from '../brand'

defineProps({
  open: { type: Boolean, default: false },
  current: { type: String, default: '' }
})
const emit = defineEmits(['close', 'pick'])

const WALLETS = [
  { id: 'Phantom', glyph: 'P', note: 'browser extension' },
  { id: 'Solflare', glyph: 'S', note: 'extension + mobile' },
  { id: 'Backpack', glyph: 'B', note: 'xNFT enabled' },
  { id: 'Local keypair', glyph: 'K', note: '~/.config/solana/id.json' }
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
    <div v-if="open" class="ab-veil" @click.self="close">
      <section class="ab-sheet" role="dialog" aria-modal="true" aria-label="Wallet">
        <header class="ab-sheet-head">
          <CoventMark :size="22" />
          <div class="ab-sheet-titles">
            <strong>{{ step === 'pick' ? 'Connect a wallet' : 'Approve signature' }}</strong>
            <span>{{ BRAND.chain }} / {{ BRAND.cluster }} / {{ current || 'disconnected' }}</span>
          </div>
          <button class="ab-sheet-close" aria-label="Close" @click="close"><OrbGlyph kind="close" /></button>
        </header>

        <div v-if="step === 'pick'" class="ab-sheet-body">
          <button v-for="w in WALLETS" :key="w.id" class="ab-wallet-opt" @click="pick(w)">
            <span class="ab-wallet-glyph">{{ w.glyph }}</span>
            <span class="ab-wallet-text">
              <strong>{{ w.id }}</strong>
              <em>{{ w.note }}</em>
            </span>
            <OrbGlyph kind="dot" />
          </button>
          <p class="ab-sheet-note">
            <OrbGlyph kind="shield" />
            local preview: this screen never broadcasts a transaction
          </p>
        </div>

        <div v-else class="ab-sheet-body">
          <div class="ab-sign-card">
            <div class="ab-sign-head">
              <span class="ab-sign-icon"><OrbGlyph kind="finger" /></span>
              <div>
                <strong>{{ chosen }}</strong>
                <p>Requesting a signature for a local <em>create_agent</em> instruction.</p>
              </div>
            </div>
            <dl class="ab-sign-rows">
              <div><dt>program</dt><dd>{{ BRAND.programId.slice(0, 20) }}...</dd></div>
              <div><dt>fee payer</dt><dd>{{ current || 'local signer' }}</dd></div>
              <div><dt>network fee</dt><dd>0.000005 SOL</dd></div>
            </dl>
            <div class="ab-sign-actions">
              <button class="ab-btn ab-btn--prime ab-btn--small" @click="approve"><OrbGlyph kind="check" /> approve</button>
              <button class="ab-btn ab-btn--line ab-btn--small" @click="step = 'pick'"><OrbGlyph kind="arrow" /> back</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>
