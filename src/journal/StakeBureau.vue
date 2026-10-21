<script setup>
import { computed, ref } from 'vue'
import Glyph from './Glyph.vue'
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
  <section id="vault" class="dispatch">
    <div class="dispatch-head">
      <div>
        <span class="dispatch-no">04 / economy</span>
        <h2 class="dispatch-title">Stake follows the agent</h2>
      </div>
      <p class="dispatch-note">
        Stake is the skin in the game: it is slashable when a receipt fails and it sets the
        reward weight per settled task. Council proposals move those parameters.
      </p>
    </div>

    <div class="bureau">
      <div class="stake-ledger">
        <div class="panel-head">
          <span class="label">staking vault</span>
          <span class="stamp">{{ BRAND.ticker }}</span>
        </div>

        <div class="stake-figure">
          <p class="utilisation-line">
            <strong>{{ util }}%</strong>
            <span>utilised</span>
          </p>
          <span class="utilisation"><i :style="{ width: `${util}%` }"></i></span>
        </div>

        <dl class="stake-tallies">
          <div>
            <dt>total staked</dt>
            <dd>{{ staked }} <small>{{ BRAND.ticker }}</small></dd>
          </div>
          <div>
            <dt>claimable</dt>
            <dd>{{ claimable }} <small>{{ BRAND.ticker }}</small></dd>
          </div>
          <div>
            <dt>epoch emission</dt>
            <dd>92,400 <small>{{ BRAND.ticker }}</small></dd>
          </div>
          <div>
            <dt>unbonding</dt>
            <dd>3 <small>epochs</small></dd>
          </div>
        </dl>

        <div class="stake-form">
          <label class="entry">
            <span class="entry-label">amount</span>
            <span class="amount-stepper">
              <button class="step" @click="bump(-50)" aria-label="Decrease"><Glyph kind="minus" /></button>
              <input v-model="amount" inputmode="decimal" aria-label="Stake amount" />
              <button class="step" @click="bump(50)" aria-label="Increase"><Glyph kind="plus" /></button>
            </span>
          </label>
          <div class="stake-actions">
            <button class="press press-small" @click="emit('action', { kind: 'stake', amount })">
              <Glyph kind="lock" /> stake
            </button>
            <button class="press press-small press-quiet" @click="emit('action', { kind: 'unstake', amount })">
              <Glyph kind="unlock" /> unstake
            </button>
            <button class="press press-small press-quiet" @click="emit('action', { kind: 'claim', amount: claimable })">
              <Glyph kind="trend" /> claim
            </button>
          </div>
        </div>

        <p class="stake-signer">
          <Glyph kind="vault" />
          {{ wallet ? `signer ${wallet}` : 'connect a wallet to sign the instruction' }}
        </p>
      </div>

      <div class="ballots">
        <div class="panel-head">
          <span class="label">council</span>
          <span class="stamp">quorum 51%</span>
        </div>

        <ol class="ballot-list">
          <li v-for="p in proposals" :key="p.id" class="ballot">
            <div class="ballot-head">
              <span class="ballot-id">{{ p.id }}</span>
              <span class="ballot-state" :class="`is-${p.state}`">{{ p.state }}</span>
              <span class="ballot-ends">{{ p.ends }}</span>
            </div>
            <p class="ballot-title">{{ p.title }}</p>

            <div class="ballot-vote">
              <span class="ballot-track">
                <i class="ballot-yes" :style="{ width: `${p.yes}%` }"></i>
                <i class="ballot-quorum" :style="{ left: `${p.quorum}%` }" :title="`quorum ${p.quorum}%`"></i>
              </span>
              <span>{{ p.yes }}% yes</span>
            </div>

            <div class="ballot-actions">
              <button class="vote" :class="{ 'is-cast': p.mine === true }" @click="cast(p.id, true)">
                <Glyph kind="up" /> {{ p.mine === true ? 'voted yes' : 'yes' }}
              </button>
              <button class="vote vote-no" :class="{ 'is-cast': p.mine === false }" @click="cast(p.id, false)">
                <Glyph kind="down" /> {{ p.mine === false ? 'voted no' : 'no' }}
              </button>
              <span v-if="p.mine !== null" class="ballot-stamp"><Glyph kind="check" /> recorded</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
