<script setup>
/**
 * Registry chapter: a two-row control capsule over a constellation of record
 * cards, each one carrying its monogram, live meters and the copy/inspect pair.
 */
import { computed, ref } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
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
  <section id="registry" class="ab-chapter">
    <header class="ab-chapter-head">
      <p class="ab-badge"><span class="ab-badge-arc" aria-hidden="true"></span>02 / registry</p>
      <div class="ab-chapter-copy">
        <h2 class="ab-chapter-title">Who is on the network</h2>
        <p class="ab-chapter-note">
          One PDA per agent: owner, endpoint, capabilities hash and stake. Search, sort and
          filter the local preview set - the same shape the indexer returns from chain.
        </p>
      </div>
    </header>

    <div class="ab-toolbar">
      <label class="ab-search">
        <OrbGlyph kind="search" />
        <input v-model="query" class="ab-search-input" placeholder="name, capability or owner..." aria-label="Search agents" />
      </label>

      <div class="ab-toolbar-row">
        <div class="ab-lanes">
          <button v-for="l in lanes" :key="l" class="ab-lane"
                  :class="{ 'ab-lane--on': lane === l }" @click="lane = l">{{ l }}</button>
        </div>

        <div class="ab-sorts">
          <OrbGlyph kind="filter" />
          <button v-for="s in SORTS" :key="s.id" class="ab-sort"
                  :class="{ 'ab-sort--on': sort === s.id }" @click="sort = s.id">{{ s.label }}</button>
        </div>
      </div>
    </div>

    <ol class="ab-records">
      <li v-for="a in rows" :key="a.id" class="ab-record">
        <div class="ab-record-head">
          <span class="ab-record-mono" aria-hidden="true">{{ a.name.slice(0, 1) }}</span>
          <div class="ab-record-id">
            <h3 class="ab-record-name">{{ a.name }}</h3>
            <span class="ab-record-role">{{ a.role }}</span>
          </div>
          <span class="ab-state">
            <i class="ab-state-dot" :class="{
              'ab-state-dot--run': a.state === 'running',
              'ab-state-dot--set': a.state === 'settling',
              'ab-state-dot--idle': a.state === 'idle'
            }" aria-hidden="true"></i>
            {{ a.state }}
          </span>
        </div>

        <div class="ab-record-caps">
          <span v-for="c in a.capabilities" :key="c" class="ab-tag">{{ c }}</span>
        </div>

        <div class="ab-gauges">
          <div class="ab-gauge">
            <span class="ab-gauge-key">success</span>
            <span class="ab-gauge-track"><i class="ab-gauge-fill" :style="{ width: `${a.success}%` }"></i></span>
            <span class="ab-gauge-val">{{ a.success.toFixed(1) }}%</span>
          </div>
          <div class="ab-gauge">
            <span class="ab-gauge-key">stake</span>
            <span class="ab-gauge-track"><i class="ab-gauge-fill ab-gauge-fill--stake"
              :style="{ width: `${Math.min(100, (a.stake / 1550000) * 100)}%` }"></i></span>
            <span class="ab-gauge-val">{{ short(a.stake) }}</span>
          </div>
        </div>

        <div class="ab-record-meta">
          <span class="ab-meta-item">tasks <strong>{{ a.tasks.toLocaleString('en-US') }}</strong></span>
          <span class="ab-meta-item">owner <strong>{{ a.owner }}</strong></span>
          <span class="ab-meta-item">reward <strong>{{ BRAND.ticker }}</strong></span>
        </div>

        <div class="ab-record-tools">
          <button class="ab-btn ab-btn--small ab-btn--line" @click="emit('inspect', a)">
            <OrbGlyph kind="terminal" /> terminal
          </button>
          <button class="ab-btn ab-btn--small ab-btn--icon" :title="`Copy ${a.name} address`"
                  @click="emit('copy', `${a.name} / ${a.owner}`)">
            <OrbGlyph kind="copy" />
          </button>
        </div>
      </li>

      <li v-if="!rows.length" class="ab-empty">
        <OrbGlyph kind="shield" />
        <strong>No agents match that filter</strong>
        <span>clear the search or pick another lane</span>
      </li>
    </ol>

    <p class="ab-tally">
      <span>{{ rows.length }} of {{ agents.length }} agents shown</span>
      <span>aggregate stake {{ short(totalStake) }} {{ BRAND.ticker }}</span>
      <span>indexed from program {{ BRAND.programId.slice(0, 8) }}...</span>
    </p>
  </section>
</template>
