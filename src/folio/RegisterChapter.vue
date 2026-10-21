<script setup>
/**
 * Chapter two — the agent register as a two-column index of ruled entries with
 * search, lane filter and rank order.
 */
import { computed, ref } from 'vue'
import Icon from './Icon.vue'
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
  <section id="registry" class="foil-chapter">
    <p class="foil-chaptermark">02 / registry</p>

    <div class="foil-chapterhead">
      <h2 class="foil-chaptertitle">Who is on the network</h2>
      <p class="foil-chapternote">
        One PDA per agent: owner, endpoint, capabilities hash and stake. Search, sort and
        filter the local preview set - the same shape the indexer returns from chain.
      </p>
    </div>

    <div class="foil-chapterbody">
      <div class="foil-controls">
        <label class="foil-search">
          <Icon kind="search" />
          <input v-model="query" class="foil-searchinput" placeholder="name, capability or owner..." aria-label="Search agents" />
        </label>

        <div class="foil-lanes">
          <button v-for="l in lanes" :key="l" class="foil-lanebtn" :class="{ 'is-on': lane === l }" @click="lane = l">{{ l }}</button>
        </div>

        <div class="foil-sorts">
          <Icon kind="filter" />
          <button v-for="s in SORTS" :key="s.id" class="foil-sortbtn" :class="{ 'is-on': sort === s.id }" @click="sort = s.id">{{ s.label }}</button>
        </div>
      </div>

      <ol class="foil-register">
        <li v-for="a in rows" :key="a.id" class="foil-entry">
          <div class="foil-entrytop">
            <span class="foil-entryno">{{ a.name.slice(0, 1) }}</span>
            <h3 class="foil-entryname">{{ a.name }}</h3>
            <span class="foil-state">
              <i class="foil-statedot" :class="{ 'is-running': a.state === 'running', 'is-settling': a.state === 'settling', 'is-idle': a.state === 'idle' }"></i>
              {{ a.state }}
            </span>
          </div>

          <span class="foil-entryrole">{{ a.role }}</span>

          <div class="foil-caps">
            <span v-for="c in a.capabilities" :key="c" class="foil-tag">{{ c }}</span>
          </div>

          <div class="foil-measures">
            <div class="foil-measureline">
              <span>success</span>
              <span class="foil-meter"><i class="foil-meterfill" :style="{ width: `${a.success}%` }"></i></span>
              <span>{{ a.success.toFixed(1) }}%</span>
            </div>
            <div class="foil-measureline">
              <span>stake</span>
              <span class="foil-meter"><i class="foil-meterfill is-stake" :style="{ width: `${Math.min(100, (a.stake / 1550000) * 100)}%` }"></i></span>
              <span>{{ short(a.stake) }}</span>
            </div>
          </div>

          <div class="foil-entrymeta">
            <span>tasks <strong>{{ a.tasks.toLocaleString('en-US') }}</strong></span>
            <span>owner <strong>{{ a.owner }}</strong></span>
            <span>reward <strong>{{ BRAND.ticker }}</strong></span>
          </div>

          <div class="foil-entrytools">
            <button class="foil-btn foil-btn--small foil-btn--ghost" @click="emit('inspect', a)">
              <Icon kind="terminal" /> terminal
            </button>
            <button class="foil-btn foil-btn--small foil-btn--ghost" :title="`Copy ${a.name} address`" @click="emit('copy', `${a.name} / ${a.owner}`)">
              <Icon kind="copy" />
            </button>
          </div>
        </li>

        <li v-if="!rows.length" class="foil-empty">
          <Icon kind="shield" />
          <strong>No agents match that filter</strong>
          <span>clear the search or pick another lane</span>
        </li>
      </ol>

      <p class="foil-tally">
        <span>{{ rows.length }} of {{ agents.length }} agents shown</span>
        <span>aggregate stake {{ short(totalStake) }} {{ BRAND.ticker }}</span>
        <span>indexed from program {{ BRAND.programId.slice(0, 8) }}...</span>
      </p>
    </div>
  </section>
</template>
