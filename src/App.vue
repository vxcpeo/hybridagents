<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Masthead from './journal/Masthead.vue'
import FrontPage from './journal/FrontPage.vue'
import LoadDispatch from './journal/LoadDispatch.vue'
import RegistryLedger from './journal/RegistryLedger.vue'
import ReceiptLedger from './journal/ReceiptLedger.vue'
import StakeBureau from './journal/StakeBureau.vue'
import RegistrationDesk from './journal/RegistrationDesk.vue'
import Colophon from './journal/Colophon.vue'
import WalletSheet from './journal/WalletSheet.vue'
import Glyph from './journal/Glyph.vue'
import GlyphSprite from './journal/GlyphSprite.vue'
import { AGENTS, BRAND, NAV_STATS, RECEIPTS } from './brand'
import { clusterLabel, createAgentLocally } from './lib/solana'

/* --- section observer drives the index active state ----------------------- */
const active = ref('network')
let observer = null

onMounted(() => {
  const ids = ['network', 'registry', 'ledger', 'vault', 'console']
  const targets = ids.map((id) => document.getElementById(id)).filter(Boolean)
  observer = new IntersectionObserver((entries) => {
    const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (hit) active.value = hit.target.id
  }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.15, 0.4, 0.75] })
  targets.forEach((t) => observer.observe(t))
  if (window.location.hash) {
    const id = window.location.hash.slice(1)
    if (id === 'top') window.scrollTo({ top: 0 })
    else if (ids.includes(id)) active.value = id
  }
})
onBeforeUnmount(() => observer?.disconnect())

/* --- chain head ticker ----------------------------------------------------- */
const blockHeight = ref(291_884)
let ticker = 0
onMounted(() => {
  ticker = window.setInterval(() => { blockHeight.value += Math.floor(Math.random() * 3) + 1 }, 2200)
})
onBeforeUnmount(() => window.clearInterval(ticker))

/* --- wallet + notice ------------------------------------------------------- */
const wallet = ref('')
const walletOpen = ref(false)
const toast = ref(null)
let toastTimer = 0

function say(message, tone = 'ok') {
  toast.value = { message, tone }
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.value = null }, 3000)
}

async function copy(value, label = 'Copied') {
  try {
    await navigator.clipboard.writeText(String(value))
    say(`${label} · ${String(value).slice(0, 22)}${String(value).length > 22 ? '…' : ''}`)
  } catch {
    say(`Clipboard blocked — ${String(value).slice(0, 26)}`, 'warn')
  }
}

function navigate(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* --- registration ---------------------------------------------------------- */
const busy = ref(false)
const result = ref(null)

function deploy(form) {
  busy.value = true
  result.value = null
  createAgentLocally({ owner: wallet.value, name: form.name || 'local-agent' }).then((r) => {
    result.value = r
    busy.value = false
    say(r.mode === 'localnet' ? `PDA confirmed on ${clusterLabel}` : 'Preview PDA retained (no validator)')
    if (r.mode !== 'localnet') return
  })
}

function inspect(agent) {
  navigate('console')
  say(`Opening ${agent.name} — register a sibling or reuse this endpoint`)
}

const online = AGENTS.filter((a) => a.state !== 'idle').length + 1278
const refresh = () => say('Re-indexed local preview ledger')
</script>

<template>
  <div class="gazette">
    <GlyphSprite />
    <div class="gazette-glow" aria-hidden="true"></div>

    <Masthead :active="active" :wallet="wallet" :online="online" :block-height="blockHeight"
              @navigate="navigate" @connect="walletOpen = true" />

    <main class="gazette-main">
      <FrontPage :agents="AGENTS" :block-height="blockHeight" :epoch="NAV_STATS.epoch"
                 :settled24h="NAV_STATS.settled24h" :staked="NAV_STATS.staked"
                 @primary="navigate('console')" @secondary="navigate('ledger')"
                 @copy="(v) => copy(v, 'Program id')" />

      <LoadDispatch :block-height="blockHeight" />
      <RegistryLedger :agents="AGENTS" @copy="(v) => copy(v, 'Address')" @inspect="inspect" />
      <ReceiptLedger :receipts="RECEIPTS" :block-height="blockHeight"
                     @copy="(v) => copy(v, 'Receipt')" @refresh="refresh" />
      <StakeBureau :wallet="wallet" :staked="NAV_STATS.staked"
                   @action="(a) => copy(`${a.kind} ${a.amount} ${BRAND.ticker}`, 'Queued')"
                   @vote="(v) => say(`Vote recorded locally · ${v.id}`)" />
      <RegistrationDesk :wallet="wallet" :busy="busy" :result="result"
                        @deploy="deploy" @connect="walletOpen = true" />
    </main>

    <Colophon @navigate="navigate" @copy="(v) => copy(v, 'Copied')" />

    <WalletSheet :open="walletOpen" :current="wallet"
                 @close="walletOpen = false"
                 @pick="(id) => { wallet = id; walletOpen = false; say(`${id} connected · ${clusterLabel}`) }" />

    <transition name="toast">
      <div v-if="toast" class="notice" :class="`is-${toast.tone}`" role="status">
        <Glyph :kind="toast.tone === 'warn' ? 'alert' : 'check'" />
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>
