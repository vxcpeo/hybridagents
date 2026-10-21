<script setup>
/**
 * Chapter five — the registration desk: the machine record printed across the
 * page, the questionnaire typeset beneath it.
 */
import { reactive, ref, watch } from 'vue'
import Icon from './Icon.vue'
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
  `quittra@local:~$ quittra register --cluster ${BRAND.cluster}`,
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
  <section id="console" class="foil-chapter">
    <p class="foil-chaptermark">05 / console</p>

    <div class="foil-chapterhead">
      <h2 class="foil-chaptertitle">Register, then let it run</h2>
      <p class="foil-chapternote">
        A registration writes one account: name, endpoint, capabilities hash and the owner
        key. Nothing is submitted until a wallet signs the instruction.
      </p>
    </div>

    <div class="foil-chapterbody">
      <div class="foil-desk">
        <div class="foil-transcript">
          <div class="foil-transcriptbar">
            <span class="foil-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="foil-transcriptpath">quittra-console / {{ BRAND.cluster }}</span>
            <span class="foil-transcriptcargo">[::]</span>
          </div>
          <pre class="foil-transcriptbody"><code><span v-for="(l, i) in lines" :key="i" class="foil-line"
            :class="{ 'is-ok': l.startsWith('[ok]'), 'is-warn': l.startsWith('[warn]'), 'is-dim': l.startsWith('->') }">{{ l }}
</span><span class="foil-cursor">_</span></code></pre>
          <p class="foil-transcriptfoot">
            <Icon kind="terminal" />
            {{ result ? `result / ${shortPda(result.agent)}` : 'idle / waiting for a registration' }}
          </p>
        </div>

        <form class="foil-form" @submit.prevent="submit">
          <div class="foil-formhead">
            <span class="foil-label">agent profile</span>
            <span class="foil-stamp" :class="wallet ? 'is-good' : ''">
              <Icon kind="finger" />{{ wallet || 'no signer' }}
            </span>
          </div>

          <div class="foil-formbody">
            <label class="foil-field">
              <span class="foil-fieldlabel">codename</span>
              <input v-model="form.name" class="foil-input" placeholder="e.g. Kestrel Drift" required />
            </label>
            <label class="foil-field">
              <span class="foil-fieldlabel">stake / {{ BRAND.ticker }}</span>
              <input v-model="form.stake" class="foil-input" inputmode="decimal" placeholder="250" />
            </label>
            <label class="foil-field foil-field--wide">
              <span class="foil-fieldlabel">mission</span>
              <textarea v-model="form.mission" class="foil-textarea" rows="3" placeholder="What should this agent own end to end?" />
            </label>
            <label class="foil-field">
              <span class="foil-fieldlabel">capabilities</span>
              <input v-model="form.capabilities" class="foil-input" placeholder="rust, anchor, indexing" />
            </label>
            <label class="foil-field">
              <span class="foil-fieldlabel">endpoint</span>
              <input v-model="form.endpoint" class="foil-input" placeholder="http://127.0.0.1:8899" />
            </label>
          </div>

          <p class="foil-formhint">
            <Icon kind="shield" />
            the capabilities hash is the only capability claim the program stores;
            endpoints are resolved off-chain.
          </p>

          <div class="foil-formactions">
            <button type="submit" class="foil-btn" :disabled="busy">
              <Icon kind="rocket" /> {{ busy ? 'queuing...' : 'register agent' }}
            </button>
            <button v-if="!wallet" type="button" class="foil-btn foil-btn--ghost" @click="emit('connect')">
              <Icon kind="finger" /> connect wallet
            </button>
          </div>

          <span class="foil-formenter"><Icon kind="enter" /> enter submits / nothing leaves this machine</span>
        </form>
      </div>
    </div>
  </section>
</template>
