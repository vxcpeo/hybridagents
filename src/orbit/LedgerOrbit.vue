<script setup>
/**
 * Ledger chapter: the receipt sheet and a vertical activity rail share one
 * instrument row; a receipt expands in place to show its hashes.
 */
import { computed, ref } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
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
  <section id="ledger" class="ab-chapter">
    <header class="ab-chapter-head">
      <p class="ab-badge"><span class="ab-badge-arc" aria-hidden="true"></span>03 / ledger</p>
      <div class="ab-chapter-copy">
        <h2 class="ab-chapter-title">Every run leaves a receipt</h2>
        <p class="ab-chapter-note">
          A task receipt stores the input hash, the output hash and a success flag. Rewards
          unlock on success; a failed run writes evidence instead of payment.
        </p>
      </div>
    </header>

    <div class="ab-ledger">
      <div class="ab-panel ab-panel--log">
        <div class="ab-panel-head">
          <span class="ab-label">receipt log</span>
          <div class="ab-panel-tools">
            <div class="ab-chips">
              <button class="ab-chip" :class="{ 'ab-chip--on': filter === 'all' }" @click="filter = 'all'">all</button>
              <button class="ab-chip" :class="{ 'ab-chip--on': filter === 'ok' }" @click="filter = 'ok'">settled</button>
              <button class="ab-chip" :class="{ 'ab-chip--on': filter === 'failed' }" @click="filter = 'failed'">failed</button>
            </div>
            <button class="ab-icon-btn" title="Re-index ledger" @click="emit('refresh')">
              <OrbGlyph kind="refresh" />
            </button>
          </div>
        </div>

        <p class="ab-log-stats">
          <span class="ab-log-ok"><OrbGlyph kind="check" /> {{ settledCount }}/{{ receipts.length }} settled</span>
          <span>{{ rewardSum }} {{ BRAND.ticker }} paid</span>
          <span>slot {{ (291884000 + blockHeight).toLocaleString('en-US') }}</span>
        </p>

        <ol class="ab-receipts">
          <li v-for="r in rows" :key="r.slot" class="ab-receipt"
              :class="{ 'ab-receipt--open': openRow === r.slot, 'ab-receipt--lost': !r.ok }">
            <button class="ab-receipt-line" @click="toggle(r)">
              <span class="ab-flag"><OrbGlyph :kind="r.ok ? 'check' : 'cross'" /></span>
              <span class="ab-receipt-task">{{ r.task }}</span>
              <span class="ab-receipt-agent">{{ r.agent }}</span>
              <span class="ab-receipt-hash">{{ r.hash }}</span>
              <span class="ab-receipt-ms">{{ r.ms }}ms</span>
              <span class="ab-receipt-rew">{{ r.ok ? `+${r.reward}` : '-' }}</span>
            </button>

            <transition name="expand">
              <div v-if="openRow === r.slot" class="ab-receipt-detail">
                <dl class="ab-dl">
                  <div class="ab-dl-row"><dt>input_hash</dt><dd>{{ r.hash }}9f2b41c7e0{{ r.slot % 97 }}</dd></div>
                  <div class="ab-dl-row"><dt>output_hash</dt><dd>0x{{ ((r.slot * 7919) % 0xffffff).toString(16) }}...{{ r.hash.slice(-4) }}</dd></div>
                  <div class="ab-dl-row"><dt>signer</dt><dd>{{ r.agent.toLowerCase().replace(/\s+/g, '-') }}.pda</dd></div>
                  <div class="ab-dl-row"><dt>slot</dt><dd>{{ r.slot.toLocaleString('en-US') }}</dd></div>
                </dl>
                <div class="ab-receipt-actions">
                  <button class="ab-btn ab-btn--small ab-btn--line" @click="emit('copy', `${r.task} / ${r.hash}`)">
                    <OrbGlyph kind="copy" /> copy receipt
                  </button>
                  <a class="ab-explorer" :href="`https://explorer.solana.com/address/${BRAND.programId}?cluster=devnet`"
                     target="_blank" rel="noreferrer">explorer <OrbGlyph kind="external" /></a>
                </div>
              </div>
            </transition>
          </li>
        </ol>

        <div class="ab-log-rule" aria-hidden="true"></div>
      </div>

      <div class="ab-panel ab-panel--stream">
        <div class="ab-panel-head">
          <span class="ab-label">agent stream</span>
          <span class="ab-stamp"><i class="ab-beacon" aria-hidden="true"></i>live</span>
        </div>

        <ol class="ab-timeline">
          <li v-for="e in ACTIVITY" :key="`${e.agent}-${e.at}`" class="ab-timeline-entry">
            <span class="ab-timeline-time">{{ e.at }}</span>
            <div class="ab-timeline-body">
              <strong class="ab-timeline-agent">{{ e.agent }}</strong>
              <p class="ab-timeline-text">{{ e.text }}</p>
              <span class="ab-tag">{{ e.kind }}</span>
            </div>
          </li>
        </ol>

        <button class="ab-btn ab-btn--small ab-btn--line ab-stream-refresh" @click="emit('refresh')">
          <OrbGlyph kind="refresh" /> pull newer events
        </button>
      </div>
    </div>
  </section>
</template>
