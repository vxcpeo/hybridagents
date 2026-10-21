<script setup>
import { computed, ref } from 'vue'
import { Check, Lock, Minus, Plus, ThumbsDown, ThumbsUp, TrendingUp, Unlock, Vault as VaultIcon } from 'lucide-vue-next'
import { BRAND, PROPOSALS } from '../brand'

const props = defineProps({
  wallet: { type: String, default: '' },
  staked: { type: String, default: '42.8M' }
})
const emit = defineEmits(['action', 'vote'])

const amount = ref('250')
const util = ref(68)
const claimable = ref('184.20')

const gauge = computed(() => {
  const r = 54
  const c = 2 * Math.PI * r
  return { c, dash: (util.value / 100) * c, r }
})

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
  <section id="vault" class="section">
    <div class="shell">
      <header class="section__head">
        <div>
          <span class="tag">04 / economy</span>
          <h2 class="section__title">Stake follows the agent</h2>
        </div>
        <p class="section__note">
          Stake is the skin in the game: it is slashable when a receipt fails and it sets the
          reward weight per settled task. Council proposals move those parameters.
        </p>
      </header>

      <div class="split">
        <article class="panel vault">
          <div class="panel__top">
            <span class="panel__label">staking vault</span>
            <span class="chip mono">{{ BRAND.ticker }}</span>
          </div>

          <div class="vault__body">
            <div class="gauge">
              <svg viewBox="0 0 130 130" aria-hidden="true">
                <defs>
                  <linearGradient id="vault-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#22f5c8" />
                    <stop offset="60%" stop-color="#00d0ff" />
                    <stop offset="100%" stop-color="#7c5cff" />
                  </linearGradient>
                </defs>
                <circle cx="65" cy="65" :r="gauge.r" fill="none" stroke="rgba(120,180,255,0.14)" stroke-width="9" />
                <circle cx="65" cy="65" :r="gauge.r" fill="none" stroke="url(#vault-grad)" stroke-width="9"
                        stroke-linecap="round" :stroke-dasharray="`${gauge.dash} ${gauge.c}`" transform="rotate(-90 65 65)" />
              </svg>
              <div class="gauge__mid">
                <strong class="tnum">{{ util }}%</strong>
                <span class="mono">utilised</span>
              </div>
            </div>

            <div class="vault__stats">
              <div>
                <span class="panel__label">total staked</span>
                <strong class="tnum">{{ staked }} <small>{{ BRAND.ticker }}</small></strong>
              </div>
              <div>
                <span class="panel__label">claimable</span>
                <strong class="tnum">{{ claimable }} <small>{{ BRAND.ticker }}</small></strong>
              </div>
              <div>
                <span class="panel__label">epoch emission</span>
                <strong class="tnum">92,400 <small>{{ BRAND.ticker }}</small></strong>
              </div>
              <div>
                <span class="panel__label">unbonding</span>
                <strong class="tnum">3 <small>epochs</small></strong>
              </div>
            </div>
          </div>

          <div class="vault__form">
            <label class="field">
              <span class="mono">amount</span>
              <div class="stepper">
                <button class="mini" @click="bump(-50)" aria-label="Decrease"><Minus :size="13" /></button>
                <input v-model="amount" inputmode="decimal" aria-label="Stake amount" />
                <button class="mini" @click="bump(50)" aria-label="Increase"><Plus :size="13" /></button>
              </div>
            </label>
            <div class="vault__actions">
              <button class="btn btn--sm" @click="emit('action', { kind: 'stake', amount })">
                <Lock :size="12" /> stake
              </button>
              <button class="btn btn--sm btn--ghost" @click="emit('action', { kind: 'unstake', amount })">
                <Unlock :size="12" /> unstake
              </button>
              <button class="btn btn--sm btn--violet" @click="emit('action', { kind: 'claim', amount: claimable })">
                <TrendingUp :size="12" /> claim
              </button>
            </div>
          </div>

          <p class="vault__foot mono">
            <VaultIcon :size="12" />
            {{ wallet ? `signer ${wallet}` : 'connect a wallet to sign the instruction' }}
          </p>
        </article>

        <article class="panel council">
          <div class="panel__top">
            <span class="panel__label">council</span>
            <span class="chip chip--violet mono">quorum 51%</span>
          </div>

          <ul class="props">
            <li v-for="p in proposals" :key="p.id" class="prop">
              <div class="prop__head">
                <span class="prop__id mono">{{ p.id }}</span>
                <span class="prop__state mono" :class="`prop__state--${p.state}`">{{ p.state }}</span>
                <span class="prop__ends mono">{{ p.ends }}</span>
              </div>
              <p class="prop__title">{{ p.title }}</p>

              <div class="prop__vote">
                <div class="prop__track">
                  <i class="prop__yes" :style="{ width: `${p.yes}%` }"></i>
                  <i class="prop__quorum" :style="{ left: `${p.quorum}%` }" :title="`quorum ${p.quorum}%`"></i>
                </div>
                <span class="mono tnum">{{ p.yes }}% yes</span>
              </div>

              <div class="prop__actions">
                <button class="vbtn" :class="{ on: p.mine === true }" @click="cast(p.id, true)">
                  <ThumbsUp :size="12" /> {{ p.mine === true ? 'voted yes' : 'yes' }}
                </button>
                <button class="vbtn vbtn--no" :class="{ on: p.mine === false }" @click="cast(p.id, false)">
                  <ThumbsDown :size="12" /> {{ p.mine === false ? 'voted no' : 'no' }}
                </button>
                <span v-if="p.mine !== null" class="prop__stamp mono"><Check :size="11" /> recorded</span>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 14px; align-items: start; }

.vault__body { display: grid; grid-template-columns: 148px minmax(0, 1fr); gap: 18px; padding: 18px 16px 12px; align-items: center; }
.gauge { position: relative; width: 148px; }
.gauge svg { width: 100%; }
.gauge__mid { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 2px; }
.gauge__mid strong { font-size: 25px; letter-spacing: -0.04em; }
.gauge__mid span { font-size: 9px; color: var(--ink-ghost); letter-spacing: 0.12em; text-transform: uppercase; }

.vault__stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.vault__stats div { display: grid; gap: 5px; }
.vault__stats strong { font-size: 17px; letter-spacing: -0.02em; }
.vault__stats small { font-size: 10px; color: var(--ink-faint); font-weight: 400; }

.vault__form { display: grid; gap: 12px; padding: 6px 16px 16px; }
.field { display: grid; gap: 7px; }
.field .mono { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-ghost); }
.stepper { display: grid; grid-template-columns: 38px minmax(0, 1fr) 38px; align-items: center; border: 1px solid var(--line-soft); border-radius: 10px; overflow: hidden; background: rgba(4, 7, 15, 0.5); }
.stepper input { height: 40px; border: 0; background: none; outline: none; text-align: center; font: 500 16px/1 var(--mono); }
.mini { display: grid; place-items: center; height: 40px; color: var(--ink-faint); border: 0; }
.mini:hover { color: var(--neon); background: rgba(34, 245, 200, 0.07); }
.vault__actions { display: flex; gap: 8px; flex-wrap: wrap; }
.vault__actions .btn { flex: 1 1 96px; }
.vault__foot { display: inline-flex; align-items: center; gap: 8px; padding: 0 16px 16px; font-size: 10px; color: var(--ink-ghost); }

.props { padding: 4px; }
.prop { padding: 13px 12px; border-radius: 10px; transition: background var(--fast); }
.prop + .prop { border-top: 1px solid var(--line-soft); }
.prop:hover { background: rgba(255, 255, 255, 0.02); }
.prop__head { display: flex; align-items: center; gap: 9px; }
.prop__id { font-size: 10.5px; color: var(--neon); }
.prop__state { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 7px; border-radius: 999px; }
.prop__state--open { color: var(--warn); background: rgba(255, 180, 84, 0.12); }
.prop__state--passed { color: var(--neon); background: rgba(34, 245, 200, 0.12); }
.prop__ends { margin-left: auto; font-size: 9.5px; color: var(--ink-ghost); }
.prop__title { margin: 9px 0 10px; font-size: 13px; line-height: 1.45; }

.prop__vote { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 10px; }
.prop__track { position: relative; height: 6px; border-radius: 999px; background: rgba(120, 180, 255, 0.12); }
.prop__yes { position: absolute; inset: 0 auto 0 0; border-radius: 999px; background: linear-gradient(90deg, var(--neon), var(--neon-2)); box-shadow: 0 0 14px rgba(34, 245, 200, 0.5); }
.prop__quorum { position: absolute; top: -3px; width: 2px; height: 12px; background: var(--ink-faint); border-radius: 2px; }
.prop__vote span { font-size: 10px; color: var(--ink-dim); }

.prop__actions { display: flex; align-items: center; gap: 8px; margin-top: 11px; }
.vbtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  font: 400 10.5px/1 var(--mono);
  color: var(--ink-dim);
  transition: border-color var(--fast), color var(--fast), background var(--fast);
}
.vbtn:hover { border-color: var(--line-hot); color: var(--neon); }
.vbtn.on { border-color: rgba(34, 245, 200, 0.5); color: var(--neon); background: rgba(34, 245, 200, 0.1); }
.vbtn--no.on { border-color: rgba(255, 93, 122, 0.5); color: var(--danger); background: rgba(255, 93, 122, 0.1); }
.prop__stamp { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; font-size: 9.5px; color: var(--ink-ghost); }

@media (max-width: 1000px) {
  .split { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 520px) {
  .vault__body { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .vault__stats { width: 100%; }
}
</style>
