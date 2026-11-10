<script setup>
/**
 * Economy chapter: a conic utilisation gauge and the stake capsule share the
 * first row; the council ballots run as a three-up row underneath.
 */
import { computed, ref } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
import { BRAND, PROPOSALS } from '../brand'

const props = defineProps({
  wallet: { type: String, default: '' },
  staked: { type: String, default: '42.8M' }
})
const emit = defineEmits(['action', 'vote'])

const amount = ref('250')
const util = ref(68)
const claimable = ref('184.20')

const proposals = ref(PROPOSALS.map((p) => ({ ...p, mine: null })))

function cast(id, support) {
  proposals.value = proposals.value.map((p) => (p.id === id ? { ...p, mine: support } : p))
  emit('vote', { id, support })
}

function bump(delta) {
  amount.value = String(Math.max(0, Number(amount.value || 0) + delta))
}
</script>

<template>
  <section id="vault" class="ab-chapter">
    <header class="ab-chapter-head">
      <p class="ab-badge"><span class="ab-badge-arc" aria-hidden="true"></span>04 / economy</p>
      <div class="ab-chapter-copy">
        <h2 class="ab-chapter-title">Stake follows the agent</h2>
        <p class="ab-chapter-note">
          Stake is the skin in the game: it is slashable when a receipt fails and it sets the
          reward weight per settled task. Council proposals move those parameters.
        </p>
      </div>
    </header>

    <div class="ab-vault">
      <div class="ab-panel ab-panel--gauge">
        <div class="ab-panel-head">
          <span class="ab-label">staking vault</span>
          <span class="ab-stamp">{{ BRAND.ticker }}</span>
        </div>

        <div class="ab-gauge-dial">
          <div class="ab-gauge-disc" :style="{ '--ab-util': `${util}%` }" aria-hidden="true">
            <span class="ab-gauge-core"></span>
          </div>
          <p class="ab-util">
            <strong class="ab-util-val">{{ util }}%</strong>
            <span class="ab-util-key">utilised</span>
          </p>
        </div>

        <dl class="ab-tallies">
          <div class="ab-tally-cell">
            <dt>total staked</dt>
            <dd>{{ staked }} <small>{{ BRAND.ticker }}</small></dd>
          </div>
          <div class="ab-tally-cell">
            <dt>claimable</dt>
            <dd>{{ claimable }} <small>{{ BRAND.ticker }}</small></dd>
          </div>
          <div class="ab-tally-cell">
            <dt>epoch emission</dt>
            <dd>92,400 <small>{{ BRAND.ticker }}</small></dd>
          </div>
          <div class="ab-tally-cell">
            <dt>unbonding</dt>
            <dd>3 <small>epochs</small></dd>
          </div>
        </dl>
      </div>

      <div class="ab-panel ab-panel--stake">
        <div class="ab-panel-head">
          <span class="ab-label"><OrbGlyph kind="vault" /></span>
          <span class="ab-stamp ab-stamp--quiet"><i class="ab-beacon" aria-hidden="true"></i></span>
        </div>

        <div class="ab-stake-slot">
          <label class="ab-field">
            <span class="ab-field-key">amount</span>
            <span class="ab-stepper">
              <button type="button" class="ab-step" aria-label="Decrease" @click="bump(-50)"><OrbGlyph kind="minus" /></button>
              <input v-model="amount" class="ab-step-input" inputmode="decimal" aria-label="Stake amount" />
              <button type="button" class="ab-step" aria-label="Increase" @click="bump(50)"><OrbGlyph kind="plus" /></button>
            </span>
          </label>

          <div class="ab-stake-actions">
            <button class="ab-btn ab-btn--prime ab-btn--small" @click="emit('action', { kind: 'stake', amount })">
              <OrbGlyph kind="lock" /> stake
            </button>
            <button class="ab-btn ab-btn--line ab-btn--small" @click="emit('action', { kind: 'unstake', amount })">
              <OrbGlyph kind="unlock" /> unstake
            </button>
            <button class="ab-btn ab-btn--line ab-btn--small" @click="emit('action', { kind: 'claim', amount: claimable })">
              <OrbGlyph kind="trend" /> claim
            </button>
          </div>
        </div>

        <p class="ab-signer">
          <OrbGlyph kind="finger" />
          {{ wallet ? `signer ${wallet}` : 'connect a wallet to sign the instruction' }}
        </p>
      </div>

      <div class="ab-panel ab-panel--council">
        <div class="ab-panel-head">
          <span class="ab-label">council</span>
          <span class="ab-stamp">quorum 51%</span>
        </div>

        <ol class="ab-ballots">
          <li v-for="p in proposals" :key="p.id" class="ab-ballot">
            <div class="ab-ballot-head">
              <span class="ab-ballot-id">{{ p.id }}</span>
              <span class="ab-ballot-state" :class="`ab-ballot-state--${p.state}`">{{ p.state }}</span>
              <span class="ab-ballot-ends">{{ p.ends }}</span>
            </div>
            <p class="ab-ballot-title">{{ p.title }}</p>

            <div class="ab-ballot-vote">
              <span class="ab-ballot-track">
                <i class="ab-ballot-fill" :style="{ width: `${p.yes}%` }"></i>
                <i class="ab-quorum" :style="{ left: `${p.quorum}%` }" :title="`quorum ${p.quorum}%`" aria-hidden="true"></i>
              </span>
              <span class="ab-ballot-yes">{{ p.yes }}% yes</span>
            </div>

            <div class="ab-ballot-actions">
              <button class="ab-vote" :class="{ 'ab-vote--cast': p.mine === true }" @click="cast(p.id, true)">
                <OrbGlyph kind="up" /> {{ p.mine === true ? 'voted yes' : 'yes' }}
              </button>
              <button class="ab-vote" :class="{ 'ab-vote--cast': p.mine === false }" @click="cast(p.id, false)">
                <OrbGlyph kind="down" /> {{ p.mine === false ? 'voted no' : 'no' }}
              </button>
              <span v-if="p.mine !== null" class="ab-vote-recorded"><OrbGlyph kind="check" /> recorded</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
