<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, TriangleAlert } from 'lucide-vue-next'
import TopNav from './components/TopNav.vue'
import Hero from './components/Hero.vue'
import NetworkBento from './components/NetworkBento.vue'
import AgentRegistry from './components/AgentRegistry.vue'
import LedgerSection from './components/LedgerSection.vue'
import VaultCouncil from './components/VaultCouncil.vue'
import ConsoleSection from './components/ConsoleSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import WalletDrawer from './components/WalletDrawer.vue'
import { AGENTS, BRAND, NAV_STATS, RECEIPTS } from './brand'
import { clusterLabel, createAgentLocally } from './lib/solana'

/* --- section observer drives the top-nav active state --------------------- */
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

/* --- wallet + toast -------------------------------------------------------- */
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
  <div class="canvas" aria-hidden="true">
    <div class="canvas__grid"></div>
    <div class="canvas__aurora canvas__aurora--a"></div>
    <div class="canvas__aurora canvas__aurora--b"></div>
    <div class="canvas__aurora canvas__aurora--c"></div>
    <div class="canvas__orbit"></div>
    <div class="canvas__scan"></div>
  </div>

  <TopNav :active="active" :wallet="wallet" :online="online" :block-height="blockHeight"
          @navigate="navigate" @connect="walletOpen = true" />

  <main>
    <Hero :agents="AGENTS" :block-height="blockHeight" :epoch="NAV_STATS.epoch"
          :settled24h="NAV_STATS.settled24h" :staked="NAV_STATS.staked"
          @primary="navigate('console')" @secondary="navigate('ledger')"
          @copy="(v) => copy(v, 'Program id')" />

    <NetworkBento :block-height="blockHeight" />
    <AgentRegistry :agents="AGENTS" @copy="(v) => copy(v, 'Address')" @inspect="inspect" />
    <LedgerSection :receipts="RECEIPTS" :block-height="blockHeight"
                   @copy="(v) => copy(v, 'Receipt')" @refresh="refresh" />
    <VaultCouncil :wallet="wallet" :staked="NAV_STATS.staked"
                  @action="(a) => copy(`${a.kind} ${a.amount} ${BRAND.ticker}`, 'Queued')"
                  @vote="(v) => say(`Vote recorded locally · ${v.id}`)" />
    <ConsoleSection :wallet="wallet" :busy="busy" :result="result"
                    @deploy="deploy" @connect="walletOpen = true" />
  </main>

  <SiteFooter @navigate="navigate" @copy="(v) => copy(v, 'Copied')" />

  <WalletDrawer :open="walletOpen" :current="wallet"
                @close="walletOpen = false"
                @pick="(id) => { wallet = id; walletOpen = false; say(`${id} connected · ${clusterLabel}`) }" />

  <transition name="toast">
    <div v-if="toast" class="toast" :class="`toast--${toast.tone}`" role="status">
      <TriangleAlert v-if="toast.tone === 'warn'" :size="14" />
      <Check v-else :size="14" />
      <span>{{ toast.message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 26px;
  translate: -50% 0;
  z-index: 80;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(560px, calc(100vw - 32px));
  padding: 12px 16px;
  border: 1px solid var(--line-hot);
  border-radius: 10px;
  background: rgba(9, 16, 30, 0.96);
  color: var(--ink);
  font-size: 12px;
  box-shadow: var(--glow-soft), 0 24px 60px -30px #000;
  backdrop-filter: blur(12px);
}
.toast svg { color: var(--neon-4); flex: 0 0 auto; }
.toast--warn { border-color: rgba(255, 180, 84, 0.45); }
.toast--warn svg { color: var(--warn); }

.toast-enter-active, .toast-leave-active { transition: opacity 220ms var(--ease), transform 220ms var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }
</style>
