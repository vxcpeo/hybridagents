<script setup>
/** Wallet slip: a paper docket for connecting and approving a local signature. */
import { ref } from 'vue'
import SealMark from './SealMark.vue'
import Icon from './Icon.vue'
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
    <div v-if="open" class="foil-veil" @click.self="close">
      <section class="foil-sheet" role="dialog" aria-modal="true" aria-label="Wallet">
        <header class="foil-sheethead">
          <SealMark :size="24" />
          <div>
            <strong>{{ step === 'pick' ? 'Connect a wallet' : 'Approve signature' }}</strong>
            <span>{{ BRAND.chain }} / {{ BRAND.cluster }} / {{ current || 'disconnected' }}</span>
          </div>
          <button class="foil-sheetclose" aria-label="Close" @click="close"><Icon kind="close" /></button>
        </header>

        <div v-if="step === 'pick'" class="foil-sheetbody">
          <button v-for="w in WALLETS" :key="w.id" class="foil-walletopt" @click="pick(w)">
            <span class="foil-walletglyph">{{ w.glyph }}</span>
            <span class="foil-wallettext">
              <strong>{{ w.id }}</strong>
              <em>{{ w.note }}</em>
            </span>
            <Icon kind="dot" />
          </button>
          <p class="foil-sheetnote">
            <Icon kind="shield" />
            local preview: this screen never broadcasts a transaction
          </p>
        </div>

        <div v-else class="foil-sheetbody">
          <div class="foil-signcard">
            <div class="foil-signhead">
              <span><Icon kind="finger" /></span>
              <div>
                <strong>{{ chosen }}</strong>
                <p>Requesting a signature for a local <em>create_agent</em> instruction.</p>
              </div>
            </div>
            <dl class="foil-signrows">
              <div><dt>program</dt><dd>{{ BRAND.programId.slice(0, 20) }}...</dd></div>
              <div><dt>fee payer</dt><dd>{{ current || 'local signer' }}</dd></div>
              <div><dt>network fee</dt><dd>0.000005 SOL</dd></div>
            </dl>
            <div class="foil-signactions">
              <button class="foil-btn foil-btn--small" @click="approve"><Icon kind="check" /> approve</button>
              <button class="foil-btn foil-btn--small foil-btn--ghost" @click="step = 'pick'"><Icon kind="arrow" /> back</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>
