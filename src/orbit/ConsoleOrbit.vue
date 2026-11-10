<script setup>
/**
 * Console chapter: the machine record and the registration capsule sit in the
 * same framed desk, terminal left, questionnaire right.
 */
import { reactive, ref, watch } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
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
  `coventa@local:~$ coventa register --cluster ${BRAND.cluster}`,
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
  <section id="console" class="ab-chapter">
    <header class="ab-chapter-head">
      <p class="ab-badge"><span class="ab-badge-arc" aria-hidden="true"></span>05 / console</p>
      <div class="ab-chapter-copy">
        <h2 class="ab-chapter-title">Register, then let it run</h2>
        <p class="ab-chapter-note">
          A registration writes one account: name, endpoint, capabilities hash and the owner
          key. Nothing is submitted until a wallet signs the instruction.
        </p>
      </div>
    </header>

    <div class="ab-desk">
      <div class="ab-panel ab-panel--terminal">
        <div class="ab-term-bar">
          <span class="ab-term-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="ab-term-path">coventa-console / {{ BRAND.cluster }}</span>
          <span class="ab-term-cargo">[::]</span>
        </div>
        <pre class="ab-term-body"><code><span v-for="(l, i) in lines" :key="i" class="ab-term-line"
          :class="{ 'ab-term-line--ok': l.startsWith('[ok]'), 'ab-term-line--warn': l.startsWith('[warn]'), 'ab-term-line--dim': l.startsWith('->') }">{{ l }}
</span><span class="ab-term-cursor">_</span></code></pre>
        <p class="ab-term-foot">
          <OrbGlyph kind="terminal" />
          {{ result ? `result / ${shortPda(result.agent)}` : 'idle / waiting for a registration' }}
        </p>
      </div>

      <form class="ab-panel ab-panel--form" @submit.prevent="submit">
        <div class="ab-panel-head">
          <span class="ab-label">agent profile</span>
          <span class="ab-stamp" :class="wallet ? 'ab-stamp--ok' : ''">
            <OrbGlyph kind="finger" />{{ wallet || 'no signer' }}
          </span>
        </div>

        <div class="ab-form-grid">
          <label class="ab-field">
            <span class="ab-field-key">codename</span>
            <input v-model="form.name" class="ab-input" placeholder="e.g. Kestrel Drift" required />
          </label>
          <label class="ab-field">
            <span class="ab-field-key">stake / {{ BRAND.ticker }}</span>
            <input v-model="form.stake" class="ab-input" inputmode="decimal" placeholder="250" />
          </label>
          <label class="ab-field ab-field--wide">
            <span class="ab-field-key">mission</span>
            <textarea v-model="form.mission" class="ab-textarea" rows="3" placeholder="What should this agent own end to end?" />
          </label>
          <label class="ab-field">
            <span class="ab-field-key">capabilities</span>
            <input v-model="form.capabilities" class="ab-input" placeholder="rust, anchor, indexing" />
          </label>
          <label class="ab-field">
            <span class="ab-field-key">endpoint</span>
            <input v-model="form.endpoint" class="ab-input" placeholder="http://127.0.0.1:8899" />
          </label>
        </div>

        <p class="ab-form-hint">
          <OrbGlyph kind="shield" />
          the capabilities hash is the only capability claim the program stores;
          endpoints are resolved off-chain.
        </p>

        <div class="ab-form-actions">
          <button type="submit" class="ab-btn ab-btn--prime" :disabled="busy">
            <OrbGlyph kind="rocket" /> {{ busy ? 'queuing...' : 'register agent' }}
          </button>
          <button v-if="!wallet" type="button" class="ab-btn ab-btn--line" @click="emit('connect')">
            <OrbGlyph kind="finger" /> connect wallet
          </button>
        </div>

        <span class="ab-form-enter"><OrbGlyph kind="enter" /> enter submits / nothing leaves this machine</span>
      </form>
    </div>
  </section>
</template>
