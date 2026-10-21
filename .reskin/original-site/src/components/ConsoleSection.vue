<script setup>
import { reactive, ref, watch } from 'vue'
import { CornerDownLeft, Fingerprint, Rocket, ShieldCheck, Terminal } from 'lucide-vue-next'
import { BRAND } from '../brand'

const props = defineProps({
  wallet: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  result: { type: Object, default: null }
})
const emit = defineEmits(['deploy', 'connect'])

const form = reactive({
  name: '',
  mission: '',
  endpoint: 'http://127.0.0.1:8899',
  capabilities: 'rust, anchor',
  stake: '250'
})

const BOOT = [
  `stakri@local:~$ stakri register --cluster ${BRAND.cluster}`,
  `-> resolving program ${BRAND.programId.slice(0, 16)}...`,
  '-> deriving PDA seeds [agent, owner, u64(agent_id)]',
  '-> awaiting signer...'
]

const lines = ref([...BOOT])

watch(() => props.result, (r) => {
  if (!r) return
  lines.value = [
    ...BOOT,
    `-> owner ${(props.wallet || 'local-keypair').slice(0, 12)}`,
    `-> agent PDA ${r.agent}`,
    r.mode === 'localnet'
      ? '[ok] PDA confirmed against the local validator'
      : '[warn] validator offline - preview PDA retained',
    `-> status ${r.message}`
  ]
})

function submit() {
  emit('deploy', { ...form })
}

function shortPda(v) {
  return v && v.length > 18 ? `${v.slice(0, 8)}...${v.slice(-8)}` : v
}
</script>

<template>
  <section id="console" class="section">
    <div class="shell">
      <header class="section__head">
        <div>
          <span class="tag">05 / console</span>
          <h2 class="section__title">Register, then let it run</h2>
        </div>
        <p class="section__note">
          A registration writes one account: name, endpoint, capabilities hash and the owner
          key. Nothing is submitted until a wallet signs the instruction.
        </p>
      </header>

      <div class="console">
        <div class="term">
          <div class="term__bar">
            <span class="term__dots"><i></i><i></i><i></i></span>
            <span class="mono">stakri-console / {{ BRAND.cluster }}</span>
            <span class="mono term__cargo">[::]</span>
          </div>
          <pre class="term__body mono"><code><span v-for="(l, i) in lines" :key="i" class="term__line"
            :class="{ ok: l.startsWith('[ok]'), warn: l.startsWith('[warn]'), dim: l.startsWith('->') }">{{ l }}
</span><span class="term__cursor">_</span></code></pre>
          <div class="term__foot mono">
            <Terminal :size="12" />
            {{ result ? `result / ${shortPda(result.agent)}` : 'idle / waiting for a registration' }}
          </div>
        </div>

        <form class="panel form" @submit.prevent="submit">
          <div class="panel__top">
            <span class="panel__label">agent profile</span>
            <span class="chip mono" :class="wallet ? 'chip--good' : ''">
              <Fingerprint :size="11" />{{ wallet || 'no signer' }}
            </span>
          </div>

          <div class="form__body">
            <label class="field">
              <span class="mono">codename</span>
              <input v-model="form.name" placeholder="e.g. Kestrel Drift" required />
            </label>
            <label class="field">
              <span class="mono">mission</span>
              <textarea v-model="form.mission" rows="3" placeholder="What should this agent own end to end?" />
            </label>
            <div class="form__row">
              <label class="field">
                <span class="mono">capabilities</span>
                <input v-model="form.capabilities" placeholder="rust, anchor, indexing" />
              </label>
              <label class="field">
                <span class="mono">stake / {{ BRAND.ticker }}</span>
                <input v-model="form.stake" inputmode="decimal" placeholder="250" />
              </label>
            </div>
            <label class="field">
              <span class="mono">endpoint</span>
              <input v-model="form.endpoint" placeholder="http://127.0.0.1:8899" />
            </label>

            <p class="form__hint mono">
              <ShieldCheck :size="12" />
              the capabilities hash is the only capability claim the program stores;
              endpoints are resolved off-chain.
            </p>

            <div class="form__actions">
              <button type="submit" class="btn" :disabled="busy">
                <Rocket :size="14" /> {{ busy ? 'queuing...' : 'register agent' }}
              </button>
              <button v-if="!wallet" type="button" class="btn btn--ghost" @click="emit('connect')">
                <Fingerprint :size="13" /> connect wallet
              </button>
            </div>
            <span class="form__enter mono"><CornerDownLeft :size="11" /> enter submits / nothing leaves this machine</span>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.console { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 14px; align-items: start; }

.term {
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: linear-gradient(180deg, rgba(34, 245, 200, 0.045), rgba(4, 7, 15, 0.9));
  box-shadow: var(--shadow-panel), inset 0 0 60px -30px rgba(34, 245, 200, 0.6);
  overflow: hidden;
}
.term__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 13px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 10px;
  color: var(--ink-faint);
}
.term__dots { display: flex; gap: 5px; }
.term__dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--ink-ghost); }
.term__dots i:first-child { background: var(--danger); }
.term__dots i:nth-child(2) { background: var(--warn); }
.term__dots i:last-child { background: var(--neon); }
.term__cargo { margin-left: auto; letter-spacing: 0.3em; color: var(--ink-ghost); }

.term__body {
  margin: 0;
  padding: 16px;
  min-height: 240px;
  font-size: 11.5px;
  line-height: 1.85;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--neon);
}
.term__line { display: block; }
.term__line.dim { color: var(--ink-dim); }
.term__line.ok { color: var(--neon-4); }
.term__line.warn { color: var(--warn); }
.term__cursor { display: inline-block; color: var(--neon); animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.term__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-top: 1px solid var(--line-soft);
  font-size: 10px;
  color: var(--ink-ghost);
}

.form__body { display: grid; gap: 13px; padding: 16px; }
.form__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.field { display: grid; gap: 7px; }
.field .mono { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-ghost); }
.field input, .field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line-soft);
  border-radius: 9px;
  background: rgba(4, 7, 15, 0.55);
  outline: none;
  font-size: 12.5px;
  resize: vertical;
  transition: border-color var(--fast), box-shadow var(--fast);
}
.field input:focus, .field textarea:focus { border-color: var(--line-hot); box-shadow: 0 0 0 3px rgba(34, 245, 200, 0.12); }
.field input::placeholder, .field textarea::placeholder { color: var(--ink-ghost); }

.form__hint { display: flex; gap: 8px; align-items: flex-start; font-size: 10px; line-height: 1.6; color: var(--ink-ghost); }
.form__hint svg { flex: 0 0 auto; margin-top: 2px; color: var(--neon); }
.form__actions { display: flex; gap: 9px; flex-wrap: wrap; margin-top: 2px; }
.form__actions .btn:first-child { flex: 1 1 160px; }
.form__enter { display: inline-flex; align-items: center; gap: 6px; font-size: 9.5px; color: var(--ink-ghost); }

@media (max-width: 1000px) { .console { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 560px) { .form__row { grid-template-columns: minmax(0, 1fr); } }
</style>
