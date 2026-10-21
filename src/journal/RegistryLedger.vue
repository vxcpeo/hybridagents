<script setup>
import { computed, ref } from 'vue'
import Glyph from './Glyph.vue'
import { BRAND } from '../brand'

const props = defineProps({
  agents: { type: Array, default: () => [] }
})
const emit = defineEmits(['copy', 'inspect'])

const query = ref('')
const sort = ref('tasks')
const lane = ref('all')

const SORTS = [
  { id: 'tasks', label: 'tasks' },
  { id: 'success', label: 'success' },
  { id: 'stake', label: 'stake' }
]

const lanes = computed(() => ['all', ...new Set(props.agents.map((a) => a.state))])

const rows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return props.agents
    .filter((a) => lane.value === 'all' || a.state === lane.value)
    .filter((a) => !q || `${a.name} ${a.role} ${a.capabilities.join(' ')} ${a.owner}`.toLowerCase().includes(q))
    .sort((a, b) => (sort.value === 'success' ? b.success - a.success : sort.value === 'stake' ? b.stake - a.stake : b.tasks - a.tasks))
})

const totalStake = computed(() => props.agents.reduce((sum, a) => sum + a.stake, 0))

function short(n) {
  return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`
}
</script>

<template>
  <section id="registry" class="dispatch">
    <div class="dispatch-head">
      <div>
        <span class="dispatch-no">02 / registry</span>
        <h2 class="dispatch-title">Who is on the network</h2>
      </div>
      <p class="dispatch-note">
        One PDA per agent: owner, endpoint, capabilities hash and stake. Search, sort and
        filter the local preview set - the same shape the indexer returns from chain.
      </p>
    </div>

    <div class="register-controls">
      <label class="search-line">
        <Glyph kind="search" />
        <input v-model="query" placeholder="name, capability or owner..." aria-label="Search agents" />
      </label>

      <div class="state-tabs">
        <button v-for="l in lanes" :key="l" class="state-tab" :class="{ 'is-current': lane === l }" @click="lane = l">{{ l }}</button>
      </div>

      <div class="rank-list">
        <Glyph kind="filter" />
        <button v-for="s in SORTS" :key="s.id" class="rank" :class="{ 'is-current': sort === s.id }" @click="sort = s.id">{{ s.label }}</button>
      </div>
    </div>

    <ol class="register">
      <li v-for="a in rows" :key="a.id" class="agent">
        <span class="agent-sigil">{{ a.name.slice(0, 1) }}</span>

        <div class="agent-id">
          <h3 class="agent-name">{{ a.name }}</h3>
          <span class="agent-role">{{ a.role }}</span>
          <span class="agent-state">
            <i class="state-dot" :class="{ 'is-running': a.state === 'running', 'is-settling': a.state === 'settling', 'is-idle': a.state === 'idle' }"></i>
            {{ a.state }}
          </span>
        </div>

        <div class="agent-caps">
          <span v-for="c in a.capabilities" :key="c" class="cap">{{ c }}</span>
        </div>

        <div class="agent-measures">
          <div class="measure-row">
            <span>success</span>
            <span class="meter"><i :style="{ width: `${a.success}%` }"></i></span>
            <span>{{ a.success.toFixed(1) }}%</span>
          </div>
          <div class="measure-row">
            <span>stake</span>
            <span class="meter meter-stake"><i :style="{ width: `${Math.min(100, (a.stake / 1550000) * 100)}%` }"></i></span>
            <span>{{ short(a.stake) }}</span>
          </div>
        </div>

        <dl class="agent-meta">
          <div><dt>tasks</dt><dd>{{ a.tasks.toLocaleString('en-US') }}</dd></div>
          <div><dt>owner</dt><dd>{{ a.owner }}</dd></div>
          <div><dt>reward</dt><dd>{{ BRAND.ticker }}</dd></div>
        </dl>

        <div class="agent-tools">
          <button class="press press-small press-quiet" @click="emit('inspect', a)">
            <Glyph kind="terminal" /> terminal
          </button>
          <button class="press press-small press-quiet" :title="`Copy ${a.name} address`" @click="emit('copy', `${a.name} / ${a.owner}`)">
            <Glyph kind="copy" />
          </button>
        </div>
      </li>

      <li v-if="!rows.length" class="agent agent-empty">
        <Glyph kind="shield" />
        <strong>No agents match that filter</strong>
        <span>clear the search or pick another lane</span>
      </li>
    </ol>

    <p class="register-tally">
      <span>{{ rows.length }} of {{ agents.length }} agents shown</span>
      <span>aggregate stake {{ short(totalStake) }} {{ BRAND.ticker }}</span>
      <span>indexed from program {{ BRAND.programId.slice(0, 8) }}...</span>
    </p>
  </section>
</template>
