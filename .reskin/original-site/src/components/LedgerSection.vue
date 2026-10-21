<script setup>
import { computed, ref } from 'vue'
import { CheckCircle2, ExternalLink, FileCheck2, RefreshCw, Terminal, XCircle } from 'lucide-vue-next'
import { ACTIVITY, BRAND } from '../brand'

const props = defineProps({
  receipts: { type: Array, default: () => [] },
  blockHeight: { type: Number, default: 0 }
})
const emit = defineEmits(['copy', 'refresh'])

const filter = ref('all')
const openRow = ref(null)

const rows = computed(() =>
  filter.value === 'ok' ? props.receipts.filter((r) => r.ok)
    : filter.value === 'failed' ? props.receipts.filter((r) => !r.ok)
      : props.receipts)

const settledCount = computed(() => props.receipts.filter((r) => r.ok).length)
const rewardSum = computed(() => props.receipts.reduce((sum, r) => sum + Number(r.reward), 0).toFixed(2))

function toggle(row) {
  openRow.value = openRow.value === row.slot ? null : row.slot
}
</script>

<template>
  <section id="ledger" class="section">
    <div class="shell">
      <header class="section__head">
        <div>
          <span class="tag">03 / ledger</span>
          <h2 class="section__title">Every run leaves a receipt</h2>
        </div>
        <p class="section__note">
          A task receipt stores the input hash, the output hash and a success flag. Rewards
          unlock on success; a failed run writes evidence instead of payment.
        </p>
      </header>

      <div class="split">
        <article class="panel ledger">
          <div class="panel__top">
            <span class="panel__label">receipt log</span>
            <div class="ledger__tools">
              <div class="seg mono">
                <button :class="{ on: filter === 'all' }" @click="filter = 'all'">all</button>
                <button :class="{ on: filter === 'ok' }" @click="filter = 'ok'">settled</button>
                <button :class="{ on: filter === 'failed' }" @click="filter = 'failed'">failed</button>
              </div>
              <button class="mini" title="Re-index ledger" @click="emit('refresh')"><RefreshCw :size="13" /></button>
            </div>
          </div>

          <div class="stats mono">
            <span class="ok"><FileCheck2 :size="13" /> {{ settledCount }}/{{ receipts.length }} settled</span>
            <span>{{ rewardSum }} {{ BRAND.ticker }} paid</span>
            <span>slot {{ (291884000 + blockHeight).toLocaleString('en-US') }}</span>
          </div>

          <ul class="log">
            <li v-for="r in rows" :key="r.slot" class="log__row" :class="{ 'is-open': openRow === r.slot, 'is-bad': !r.ok }">
              <button class="log__main" @click="toggle(r)">
                <span class="log__icon">
                  <CheckCircle2 v-if="r.ok" :size="15" />
                  <XCircle v-else :size="15" />
                </span>
                <span class="log__task mono">{{ r.task }}</span>
                <span class="log__agent mono">{{ r.agent }}</span>
                <span class="log__hash mono">{{ r.hash }}</span>
                <span class="log__ms mono tnum">{{ r.ms }}ms</span>
                <span class="log__reward mono tnum">{{ r.ok ? `+${r.reward}` : '-' }}</span>
              </button>

              <transition name="expand">
                <div v-if="openRow === r.slot" class="log__detail">
                  <div class="kv mono"><dt>input_hash</dt><dd>{{ r.hash }}9f2b41c7e0{{ r.slot % 97 }}</dd></div>
                  <div class="kv mono"><dt>output_hash</dt><dd>0x{{ ((r.slot * 7919) % 0xffffff).toString(16) }}...{{ r.hash.slice(-4) }}</dd></div>
                  <div class="kv mono"><dt>signer</dt><dd>{{ r.agent.toLowerCase().replace(/\s+/g, '-') }}.pda</dd></div>
                  <div class="kv mono"><dt>slot</dt><dd class="tnum">{{ r.slot.toLocaleString('en-US') }}</dd></div>
                  <button class="btn btn--sm btn--ghost" @click="emit('copy', `${r.task} / ${r.hash}`)">
                    <Terminal :size="12" /> copy receipt
                  </button>
                  <a class="link mono" :href="`https://explorer.solana.com/address/${BRAND.programId}?cluster=devnet`"
                     target="_blank" rel="noreferrer">explorer <ExternalLink :size="11" /></a>
                </div>
              </transition>
            </li>
          </ul>
        </article>

        <aside class="panel stream">
          <div class="panel__top">
            <span class="panel__label">agent stream</span>
            <span class="chip chip--hot mono"><span class="beacon beacon--hot"></span>live</span>
          </div>
          <ol class="stream__list">
            <li v-for="(e, i) in ACTIVITY" :key="`${e.agent}-${e.at}`" class="stream__item" :style="{ animationDelay: `${i * 70}ms` }">
              <span class="stream__at mono">{{ e.at }}</span>
              <div class="stream__body">
                <strong>{{ e.agent }}</strong>
                <p>{{ e.text }}</p>
                <span class="chip stream__kind">{{ e.kind }}</span>
              </div>
            </li>
          </ol>
          <button class="btn btn--sm btn--ghost stream__more" @click="emit('refresh')">
            <RefreshCw :size="12" /> pull newer events
          </button>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.split { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 14px; align-items: start; }

.ledger__tools { display: flex; align-items: center; gap: 8px; }
.seg { display: flex; gap: 2px; padding: 3px; border: 1px solid var(--line-soft); border-radius: 999px; }
.seg button { height: 21px; padding: 0 10px; border-radius: 999px; font-size: 10px; color: var(--ink-faint); transition: background var(--fast), color var(--fast); }
.seg button.on { background: rgba(34, 245, 200, 0.14); color: var(--neon); }
.mini { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid var(--line-soft); border-radius: 8px; color: var(--ink-faint); }
.mini:hover { color: var(--neon); border-color: var(--line-hot); }

.stats { display: flex; flex-wrap: wrap; gap: 18px; padding: 12px 16px; border-bottom: 1px solid var(--line-soft); font-size: 10px; color: var(--ink-faint); }
.stats span { display: inline-flex; align-items: center; gap: 7px; }
.stats .ok { color: var(--neon); }

.log { padding: 4px; }
.log__main {
  display: grid;
  grid-template-columns: 22px minmax(0, 1.5fr) 92px 72px 58px 62px;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 11px;
  color: var(--ink-dim);
  transition: background var(--fast);
}
.log__main:hover { background: rgba(34, 245, 200, 0.055); }
.log__row.is-open .log__main { background: rgba(34, 245, 200, 0.075); }
.log__icon { color: var(--neon); display: grid; place-items: center; }
.log__row.is-bad .log__icon { color: var(--danger); }
.log__task { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.log__agent, .log__hash { font-size: 10px; color: var(--ink-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.log__ms { font-size: 10px; color: var(--ink-ghost); text-align: right; }
.log__reward { text-align: right; color: var(--neon-4); }
.log__row.is-bad .log__reward { color: var(--ink-ghost); }

.log__detail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) auto auto;
  align-items: center;
  gap: 10px 14px;
  padding: 4px 12px 14px 44px;
}
.kv { display: grid; gap: 2px; margin: 0; }
.kv dt { font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-ghost); }
.kv dd { margin: 0; font-size: 10.5px; color: var(--ink-dim); overflow: hidden; text-overflow: ellipsis; }
.link { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; color: var(--neon); }

.expand-enter-active, .expand-leave-active { transition: opacity var(--fast), transform var(--fast); }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-4px); }

.stream__list { padding: 6px 4px 0; }
.stream__item { display: grid; grid-template-columns: 44px 1fr; gap: 11px; padding: 11px 12px; border-bottom: 1px solid var(--line-soft); animation: fade 520ms var(--ease) both; }
.stream__item:last-of-type { border-bottom: 0; }
.stream__at { font-size: 10px; color: var(--ink-ghost); padding-top: 2px; }
.stream__body { display: grid; gap: 5px; }
.stream__body strong { font-size: 12px; }
.stream__body p { font-size: 11.5px; line-height: 1.5; color: var(--ink-dim); }
.stream__kind { justify-self: start; height: 20px; font-size: 9.5px; }
.stream__more { margin: 10px 14px 14px; width: calc(100% - 28px); }

@keyframes fade { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }

@media (max-width: 1080px) {
  .split { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .log__main { grid-template-columns: 20px minmax(0, 1fr) 58px 58px; }
  .log__agent, .log__hash { display: none; }
  .log__detail { grid-template-columns: minmax(0, 1fr); padding-left: 32px; }
}
</style>
