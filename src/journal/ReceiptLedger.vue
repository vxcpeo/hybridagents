<script setup>
import { computed, ref } from 'vue'
import Glyph from './Glyph.vue'
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
  <section id="ledger" class="dispatch">
    <div class="dispatch-head">
      <div>
        <span class="dispatch-no">03 / ledger</span>
        <h2 class="dispatch-title">Every run leaves a receipt</h2>
      </div>
      <p class="dispatch-note">
        A task receipt stores the input hash, the output hash and a success flag. Rewards
        unlock on success; a failed run writes evidence instead of payment.
      </p>
    </div>

    <div class="ledger-body">
      <div class="receipt-log">
        <div class="receipt-log-head">
          <span class="label">receipt log</span>
          <div class="receipt-log-tools">
            <div class="range">
              <button :class="{ 'is-current': filter === 'all' }" @click="filter = 'all'">all</button>
              <button :class="{ 'is-current': filter === 'ok' }" @click="filter = 'ok'">settled</button>
              <button :class="{ 'is-current': filter === 'failed' }" @click="filter = 'failed'">failed</button>
            </div>
            <button class="icon-press" title="Re-index ledger" @click="emit('refresh')"><Glyph kind="refresh" /></button>
          </div>
        </div>

        <p class="receipt-log-stats">
          <span class="receipt-log-ok"><Glyph kind="check" /> {{ settledCount }}/{{ receipts.length }} settled</span>
          <span>{{ rewardSum }} {{ BRAND.ticker }} paid</span>
          <span>slot {{ (291884000 + blockHeight).toLocaleString('en-US') }}</span>
        </p>

        <ol class="receipts">
          <li v-for="r in rows" :key="r.slot" class="receipt" :class="{ 'is-open': openRow === r.slot, 'is-slash': !r.ok }">
            <button class="receipt-line" @click="toggle(r)">
              <span class="receipt-flag"><Glyph :kind="r.ok ? 'check' : 'cross'" /></span>
              <span class="receipt-task">{{ r.task }}</span>
              <span class="receipt-agent">{{ r.agent }}</span>
              <span class="receipt-hash">{{ r.hash }}</span>
              <span class="receipt-ms">{{ r.ms }}ms</span>
              <span class="receipt-reward">{{ r.ok ? `+${r.reward}` : '-' }}</span>
            </button>

            <transition name="expand">
              <div v-if="openRow === r.slot" class="receipt-detail">
                <dl class="kv-list">
                  <div class="kv"><dt>input_hash</dt><dd>{{ r.hash }}9f2b41c7e0{{ r.slot % 97 }}</dd></div>
                  <div class="kv"><dt>output_hash</dt><dd>0x{{ ((r.slot * 7919) % 0xffffff).toString(16) }}...{{ r.hash.slice(-4) }}</dd></div>
                  <div class="kv"><dt>signer</dt><dd>{{ r.agent.toLowerCase().replace(/\s+/g, '-') }}.pda</dd></div>
                  <div class="kv"><dt>slot</dt><dd>{{ r.slot.toLocaleString('en-US') }}</dd></div>
                </dl>
                <button class="press press-small press-quiet" @click="emit('copy', `${r.task} / ${r.hash}`)">
                  <Glyph kind="copy" /> copy receipt
                </button>
                <a class="explorer" :href="`https://explorer.solana.com/address/${BRAND.programId}?cluster=devnet`"
                   target="_blank" rel="noreferrer">explorer <Glyph kind="external" /></a>
              </div>
            </transition>
          </li>
        </ol>
      </div>

      <div class="broadside">
        <div class="broadside-head">
          <span class="label">agent stream</span>
          <span class="stamp"><span class="live-dot"></span>live</span>
        </div>
        <ol class="broadside-list">
          <li v-for="(e, i) in ACTIVITY" :key="`${e.agent}-${e.at}`" class="broadside-item">
            <span class="broadside-at">{{ e.at }}</span>
            <div class="broadside-body">
              <strong>{{ e.agent }}</strong>
              <p>{{ e.text }}</p>
              <span class="cap">{{ e.kind }}</span>
            </div>
          </li>
        </ol>
        <button class="press press-small press-quiet" @click="emit('refresh')">
          <Glyph kind="refresh" /> pull newer events
        </button>
      </div>
    </div>
  </section>
</template>
