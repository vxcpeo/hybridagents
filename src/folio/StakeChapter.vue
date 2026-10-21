<script setup>
/**
 * Chapter four — the economy split into a staking leaf and a council ballot
 * sheet, both set on ruled paper.
 */
import { computed, ref } from 'vue'
import Icon from './Icon.vue'
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
  <section id="vault" class="foil-chapter">
    <p class="foil-chaptermark">04 / economy</p>

    <div class="foil-chapterhead">
      <h2 class="foil-chaptertitle">Stake follows the agent</h2>
      <p class="foil-chapternote">
        Stake is the skin in the game: it is slashable when a receipt fails and it sets the
        reward weight per settled task. Council proposals move those parameters.
      </p>
    </div>

    <div class="foil-chapterbody">
      <div class="foil-vault">
        <div class="foil-vaultmain">
          <div class="foil-vaulthead">
            <span class="foil-label">staking vault</span>
            <span class="foil-stamp">{{ BRAND.ticker }}</span>
          </div>

          <div class="foil-utilisation">
            <p class="foil-utilisationline">
              <strong>{{ util }}%</strong>
              <span>utilised</span>
            </p>
            <span class="foil-utilisationbar"><i :style="{ width: `${util}%` }"></i></span>
          </div>

          <dl class="foil-tallies">
            <div class="foil-tallycell">
              <dt>total staked</dt>
              <dd>{{ staked }} <small>{{ BRAND.ticker }}</small></dd>
            </div>
            <div class="foil-tallycell">
              <dt>claimable</dt>
              <dd>{{ claimable }} <small>{{ BRAND.ticker }}</small></dd>
            </div>
            <div class="foil-tallycell">
              <dt>epoch emission</dt>
              <dd>92,400 <small>{{ BRAND.ticker }}</small></dd>
            </div>
            <div class="foil-tallycell">
              <dt>unbonding</dt>
              <dd>3 <small>epochs</small></dd>
            </div>
          </dl>

          <div class="foil-stakeform">
            <label class="foil-field">
              <span class="foil-fieldlabel">amount</span>
              <span class="foil-stepper">
                <button class="foil-stepbtn" aria-label="Decrease" @click="bump(-50)"><Icon kind="minus" /></button>
                <input v-model="amount" class="foil-stepperinput" inputmode="decimal" aria-label="Stake amount" />
                <button class="foil-stepbtn" aria-label="Increase" @click="bump(50)"><Icon kind="plus" /></button>
              </span>
            </label>
            <div class="foil-vaultactions">
              <button class="foil-btn foil-btn--small" @click="emit('action', { kind: 'stake', amount })">
                <Icon kind="lock" /> stake
              </button>
              <button class="foil-btn foil-btn--small foil-btn--ghost" @click="emit('action', { kind: 'unstake', amount })">
                <Icon kind="unlock" /> unstake
              </button>
              <button class="foil-btn foil-btn--small foil-btn--ghost" @click="emit('action', { kind: 'claim', amount: claimable })">
                <Icon kind="trend" /> claim
              </button>
            </div>
          </div>

          <p class="foil-signer">
            <Icon kind="vault" />
            {{ wallet ? `signer ${wallet}` : 'connect a wallet to sign the instruction' }}
          </p>
        </div>

        <div class="foil-ballots">
          <div class="foil-ballotshead">
            <span class="foil-label">council</span>
            <span class="foil-stamp">quorum 51%</span>
          </div>

          <ol class="foil-ballotlist">
            <li v-for="p in proposals" :key="p.id" class="foil-ballot">
              <div class="foil-ballothead">
                <span class="foil-ballotid">{{ p.id }}</span>
                <span class="foil-ballotstate" :class="`is-${p.state}`">{{ p.state }}</span>
                <span class="foil-ballotends">{{ p.ends }}</span>
              </div>
              <p class="foil-ballottitle">{{ p.title }}</p>

              <div class="foil-ballotvote">
                <span class="foil-ballotmeter">
                  <i class="foil-ballotfill" :style="{ width: `${p.yes}%` }"></i>
                  <i class="foil-quorum" :style="{ left: `${p.quorum}%` }" :title="`quorum ${p.quorum}%`"></i>
                </span>
                <span>{{ p.yes }}% yes</span>
              </div>

              <div class="foil-ballotactions">
                <button class="foil-votebtn" :class="{ 'is-cast': p.mine === true }" @click="cast(p.id, true)">
                  <Icon kind="up" /> {{ p.mine === true ? 'voted yes' : 'yes' }}
                </button>
                <button class="foil-votebtn" :class="{ 'is-cast': p.mine === false }" @click="cast(p.id, false)">
                  <Icon kind="down" /> {{ p.mine === false ? 'voted no' : 'no' }}
                </button>
                <span v-if="p.mine !== null" class="foil-votestate"><Icon kind="check" /> recorded</span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
