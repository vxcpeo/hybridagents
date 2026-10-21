<script setup>
/**
 * Chapter three — the receipt log as a ruled ledger sheet, with the agent
 * stream printed below it as a three-column bulletin.
 */
import { computed, ref } from 'vue'
import Icon from './Icon.vue'
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
  <section id="ledger" class="foil-chapter">
    <p class="foil-chaptermark">03 / ledger</p>

    <div class="foil-chapterhead">
      <h2 class="foil-chaptertitle">Every run leaves a receipt</h2>
      <p class="foil-chapternote">
        A task receipt stores the input hash, the output hash and a success flag. Rewards
        unlock on success; a failed run writes evidence instead of payment.
      </p>
    </div>

    <div class="foil-chapterbody">
      <div class="foil-log">
        <div class="foil-loghead">
          <span class="foil-label">receipt log</span>
          <div class="foil-logtools">
            <div class="foil-filters">
              <button class="foil-filterbtn" :class="{ 'is-on': filter === 'all' }" @click="filter = 'all'">all</button>
              <button class="foil-filterbtn" :class="{ 'is-on': filter === 'ok' }" @click="filter = 'ok'">settled</button>
              <button class="foil-filterbtn" :class="{ 'is-on': filter === 'failed' }" @click="filter = 'failed'">failed</button>
            </div>
            <button class="foil-iconbtn" title="Re-index ledger" @click="emit('refresh')"><Icon kind="refresh" /></button>
          </div>
        </div>

        <p class="foil-logstats">
          <span class="foil-logstat is-ok"><Icon kind="check" /> {{ settledCount }}/{{ receipts.length }} settled</span>
          <span>{{ rewardSum }} {{ BRAND.ticker }} paid</span>
          <span>slot {{ (291884000 + blockHeight).toLocaleString('en-US') }}</span>
        </p>

        <ol class="foil-receipts">
          <li v-for="r in rows" :key="r.slot" class="foil-receipt" :class="{ 'is-open': openRow === r.slot, 'is-lost': !r.ok }">
            <button class="foil-receiptline" @click="toggle(r)">
              <span class="foil-flag"><Icon :kind="r.ok ? 'check' : 'cross'" /></span>
              <span class="foil-receipttask">{{ r.task }}</span>
              <span class="foil-receiptagent">{{ r.agent }}</span>
              <span class="foil-receipthash">{{ r.hash }}</span>
              <span class="foil-receiptms">{{ r.ms }}ms</span>
              <span class="foil-receiptreward">{{ r.ok ? `+${r.reward}` : '-' }}</span>
            </button>

            <transition name="expand">
              <div v-if="openRow === r.slot" class="foil-receiptdetail">
                <dl class="foil-dl">
                  <div><dt>input_hash</dt><dd>{{ r.hash }}9f2b41c7e0{{ r.slot % 97 }}</dd></div>
                  <div><dt>output_hash</dt><dd>0x{{ ((r.slot * 7919) % 0xffffff).toString(16) }}...{{ r.hash.slice(-4) }}</dd></div>
                  <div><dt>signer</dt><dd>{{ r.agent.toLowerCase().replace(/\s+/g, '-') }}.pda</dd></div>
                  <div><dt>slot</dt><dd>{{ r.slot.toLocaleString('en-US') }}</dd></div>
                </dl>
                <div class="foil-receiptactions">
                  <button class="foil-btn foil-btn--small foil-btn--ghost" @click="emit('copy', `${r.task} / ${r.hash}`)">
                    <Icon kind="copy" /> copy receipt
                  </button>
                  <a class="foil-explorer" :href="`https://explorer.solana.com/address/${BRAND.programId}?cluster=devnet`"
                     target="_blank" rel="noreferrer">explorer <Icon kind="external" /></a>
                </div>
              </div>
            </transition>
          </li>
        </ol>

        <div class="foil-stream">
          <div class="foil-streamhead">
            <span class="foil-label">agent stream</span>
            <span class="foil-stamp"><span class="foil-livedot"></span>live</span>
          </div>
          <ol class="foil-streamlist">
            <li v-for="(e, i) in ACTIVITY" :key="`${e.agent}-${e.at}`" class="foil-streamentry">
              <span class="foil-streamtime">{{ e.at }}</span>
              <div class="foil-streambody">
                <strong>{{ e.agent }}</strong>
                <p>{{ e.text }}</p>
                <span class="foil-tag">{{ e.kind }}</span>
              </div>
            </li>
          </ol>
          <button class="foil-btn foil-btn--small foil-btn--ghost" @click="emit('refresh')">
            <Icon kind="refresh" /> pull newer events
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
