<script setup>
import { computed, ref } from 'vue'
import { ArrowUpRight, Copy, Search, ShieldCheck, SlidersHorizontal } from 'lucide-vue-next'
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
  <section id="registry" class="section">
    <div class="shell">
      <header class="section__head">
        <div>
          <span class="tag">02 / registry</span>
          <h2 class="section__title">Who is on the network</h2>
        </div>
        <p class="section__note">
          One PDA per agent: owner, endpoint, capabilities hash and stake. Search, sort and
          filter the local preview set - the same shape the indexer returns from chain.
        </p>
      </header>

      <div class="controls panel panel--flat">
        <label class="search">
          <Search :size="14" />
          <input v-model="query" placeholder="name, capability or owner..." aria-label="Search agents" />
        </label>

        <div class="lanes">
          <button v-for="l in lanes" :key="l" class="lane" :class="{ on: lane === l }" @click="lane = l">
            {{ l }}
          </button>
        </div>

        <div class="sorts mono">
          <SlidersHorizontal :size="13" />
          <button v-for="s in SORTS" :key="s.id" class="sort" :class="{ on: sort === s.id }" @click="sort = s.id">
            {{ s.label }}
          </button>
        </div>
      </div>

      <div class="grid">
        <article v-for="a in rows" :key="a.id" class="card panel">
          <div class="card__head">
            <span class="sigil mono">{{ a.name.slice(0, 1) }}</span>
            <div class="card__id">
              <h3>{{ a.name }}</h3>
              <span class="mono">{{ a.role }}</span>
            </div>
            <span class="state" :class="`state--${a.state}`">
              <i :class="['beacon', a.state === 'running' ? 'beacon--hot' : a.state === 'idle' ? 'beacon--idle' : '']"></i>
              {{ a.state }}
            </span>
          </div>

          <div class="caps">
            <span v-for="c in a.capabilities" :key="c" class="chip">{{ c }}</span>
          </div>

          <div class="bars">
            <div class="bars__row">
              <span class="mono">success</span>
              <div class="track"><i :style="{ width: `${a.success}%` }"></i></div>
              <span class="mono tnum">{{ a.success.toFixed(1) }}%</span>
            </div>
            <div class="bars__row">
              <span class="mono">stake</span>
              <div class="track track--violet"><i :style="{ width: `${Math.min(100, (a.stake / 1550000) * 100)}%` }"></i></div>
              <span class="mono tnum">{{ short(a.stake) }}</span>
            </div>
          </div>

          <dl class="meta mono">
            <div><dt>tasks</dt><dd class="tnum">{{ a.tasks.toLocaleString('en-US') }}</dd></div>
            <div><dt>owner</dt><dd>{{ a.owner }}</dd></div>
            <div><dt>reward</dt><dd>{{ BRAND.ticker }}</dd></div>
          </dl>

          <div class="card__foot">
            <button class="btn btn--sm btn--ghost" @click="emit('inspect', a)">
              <ArrowUpRight :size="12" /> terminal
            </button>
            <button class="btn btn--sm btn--ghost" :title="`Copy ${a.name} address`" @click="emit('copy', `${a.name} / ${a.owner}`)">
              <Copy :size="12" />
            </button>
          </div>
        </article>

        <article v-if="!rows.length" class="card panel empty">
          <ShieldCheck :size="20" />
          <strong>No agents match that filter</strong>
          <span class="mono">clear the search or pick another lane</span>
        </article>
      </div>

      <footer class="foot mono">
        <span>{{ rows.length }} of {{ agents.length }} agents shown</span>
        <span>aggregate stake {{ short(totalStake) }} {{ BRAND.ticker }}</span>
        <span>indexed from program {{ BRAND.programId.slice(0, 8) }}...</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-radius: var(--r);
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.search {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: 1 1 240px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: rgba(4, 7, 15, 0.5);
  color: var(--ink-faint);
}
.search input { width: 100%; border: 0; outline: none; background: none; font-size: 12.5px; }
.search input::placeholder { color: var(--ink-ghost); }

.lanes { display: flex; gap: 3px; flex-wrap: wrap; }
.lane {
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font: 400 11px/1 var(--mono);
  color: var(--ink-faint);
  transition: background var(--fast), color var(--fast);
}
.lane:hover { color: var(--ink); background: rgba(255, 255, 255, 0.04); }
.lane.on { color: var(--neon); background: rgba(34, 245, 200, 0.1); }

.sorts { display: flex; align-items: center; gap: 8px; margin-left: auto; color: var(--ink-ghost); }
.sort { font-size: 11px; color: var(--ink-faint); padding: 4px 6px; border-radius: 6px; }
.sort.on { color: var(--ink); background: rgba(255, 255, 255, 0.06); }

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.card { display: grid; gap: 13px; padding: 16px; transition: transform var(--fast), border-color var(--fast); }
.card:hover { transform: translateY(-2px); border-color: var(--line-hot); }

.card__head { display: flex; align-items: center; gap: 11px; }
.sigil {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  font-size: 15px;
  color: #04121a;
  background: linear-gradient(140deg, var(--neon), var(--neon-3));
  box-shadow: var(--glow-soft);
}
.card__id { display: grid; gap: 2px; min-width: 0; }
.card__id h3 { font-size: 14px; }
.card__id span { font-size: 10px; color: var(--ink-faint); }

.state {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  font: 400 10px/1 var(--mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-dim);
}
.state--running { color: var(--neon-2); }

.caps { display: flex; flex-wrap: wrap; gap: 6px; }

.bars { display: grid; gap: 8px; }
.bars__row { display: grid; grid-template-columns: 58px 1fr 52px; align-items: center; gap: 10px; font-size: 9.5px; color: var(--ink-ghost); }
.bars__row span:last-child { text-align: right; color: var(--ink-dim); }
.track { height: 4px; border-radius: 999px; background: rgba(120, 180, 255, 0.12); overflow: hidden; }
.track i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--neon), var(--neon-2)); box-shadow: 0 0 12px rgba(34, 245, 200, 0.6); }
.track--violet i { background: linear-gradient(90deg, var(--neon-3), #c46bff); box-shadow: 0 0 12px rgba(124, 92, 255, 0.6); }

.meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 0; padding-top: 11px; border-top: 1px solid var(--line-soft); }
.meta div { display: grid; gap: 3px; }
.meta dt { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-ghost); }
.meta dd { margin: 0; font-size: 11.5px; color: var(--ink-dim); }

.card__foot { display: flex; gap: 8px; }
.card__foot .btn:first-child { flex: 1; }

.empty { place-items: center; text-align: center; gap: 8px; padding: 40px 16px; color: var(--ink-faint); }
.empty strong { color: var(--ink); }
.empty span { font-size: 10.5px; }

.foot { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 18px; font-size: 10px; color: var(--ink-ghost); }
.foot span:last-child { margin-left: auto; }

@media (max-width: 1080px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .sorts { margin-left: 0; }
  .foot span:last-child { margin-left: 0; }
}
</style>
