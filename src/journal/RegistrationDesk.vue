<script setup>
import { reactive, ref, watch } from 'vue'
import Glyph from './Glyph.vue'
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
  <section id="console" class="dispatch">
    <div class="dispatch-head">
      <div>
        <span class="dispatch-no">05 / console</span>
        <h2 class="dispatch-title">Register, then let it run</h2>
      </div>
      <p class="dispatch-note">
        A registration writes one account: name, endpoint, capabilities hash and the owner
        key. Nothing is submitted until a wallet signs the instruction.
      </p>
    </div>

    <div class="desk">
      <div class="transcript">
        <div class="transcript-bar">
          <span class="transcript-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="transcript-path">stakri-console / {{ BRAND.cluster }}</span>
          <span class="transcript-cargo">[::]</span>
        </div>
        <pre class="transcript-body"><code><span v-for="(l, i) in lines" :key="i" class="transcript-line"
          :class="{ 'is-ok': l.startsWith('[ok]'), 'is-warn': l.startsWith('[warn]'), 'is-dim': l.startsWith('->') }">{{ l }}
</span><span class="transcript-cursor">_</span></code></pre>
        <p class="transcript-foot">
          <Glyph kind="terminal" />
          {{ result ? `result / ${shortPda(result.agent)}` : 'idle / waiting for a registration' }}
        </p>
      </div>

      <form class="questionnaire" @submit.prevent="submit">
        <div class="panel-head">
          <span class="label">agent profile</span>
          <span class="stamp" :class="wallet ? 'is-good' : ''">
            <Glyph kind="finger" />{{ wallet || 'no signer' }}
          </span>
        </div>

        <div class="questionnaire-body">
          <label class="entry">
            <span class="entry-label">codename</span>
            <input v-model="form.name" placeholder="e.g. Kestrel Drift" required />
          </label>
          <label class="entry">
            <span class="entry-label">mission</span>
            <textarea v-model="form.mission" rows="3" placeholder="What should this agent own end to end?" />
          </label>
          <div class="entry-pair">
            <label class="entry">
              <span class="entry-label">capabilities</span>
              <input v-model="form.capabilities" placeholder="rust, anchor, indexing" />
            </label>
            <label class="entry">
              <span class="entry-label">stake / {{ BRAND.ticker }}</span>
              <input v-model="form.stake" inputmode="decimal" placeholder="250" />
            </label>
          </div>
          <label class="entry">
            <span class="entry-label">endpoint</span>
            <input v-model="form.endpoint" placeholder="http://127.0.0.1:8899" />
          </label>

          <p class="questionnaire-hint">
            <Glyph kind="shield" />
            the capabilities hash is the only capability claim the program stores;
            endpoints are resolved off-chain.
          </p>

          <div class="questionnaire-actions">
            <button type="submit" class="press" :disabled="busy">
              <Glyph kind="rocket" /> {{ busy ? 'queuing...' : 'register agent' }}
            </button>
            <button v-if="!wallet" type="button" class="press press-quiet" @click="emit('connect')">
              <Glyph kind="finger" /> connect wallet
            </button>
          </div>
          <span class="questionnaire-enter"><Glyph kind="enter" /> enter submits / nothing leaves this machine</span>
        </div>
      </form>
    </div>
  </section>
</template>
