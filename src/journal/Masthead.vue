<script setup>
import { computed, ref } from 'vue'
import MastMark from './MastMark.vue'
import Glyph from './Glyph.vue'
import { BRAND, NAV } from '../brand'

const props = defineProps({
  active: { type: String, default: 'network' },
  wallet: { type: String, default: '' },
  online: { type: Number, default: 0 },
  blockHeight: { type: Number, default: 0 }
})
const emit = defineEmits(['navigate', 'connect'])

const open = ref(false)
const heightText = computed(() => props.blockHeight.toLocaleString('en-US'))
const slotText = computed(() => (291884000 + props.blockHeight).toLocaleString('en-US'))

function go(id) {
  open.value = false
  emit('navigate', id)
}
</script>

<template>
  <header class="masthead">
    <div class="masthead-band">
      <p class="band-chain" :title="`Program ${BRAND.programId}`">
        <span class="band-dot" aria-hidden="true"></span>
        <span>{{ BRAND.chain }} / {{ BRAND.cluster }}</span>
        <span class="band-slot">#{{ slotText }}</span>
      </p>

      <div class="band-tools">
        <button class="tool-connect" @click="emit('connect')">
          <Glyph kind="wallet" />
          <span>{{ wallet || 'Connect' }}</span>
        </button>
        <button class="tool-menu" :aria-expanded="open" aria-label="Toggle menu" @click="open = !open">
          <Glyph :kind="open ? 'close' : 'menu'" />
        </button>
      </div>
    </div>

    <div class="masthead-name">
      <button class="mast-brand" @click="go('top')" aria-label="Back to top">
        <MastMark :size="34" />
        <span class="mast-word">
          <strong>{{ BRAND.wordmark }}</strong>
          <em>{{ BRAND.domain }}</em>
        </span>
      </button>

      <p class="mast-run">
        <span class="run-cell"><Glyph kind="pulse" /> height {{ heightText }}</span>
        <span class="run-cell"><Glyph kind="pulse" /> {{ online.toLocaleString('en-US') }} agents online</span>
        <span class="run-cell">epoch 4471</span>
        <span class="run-cell">median settle 412 ms</span>
        <span class="run-cell run-cell--hot">all systems nominal</span>
      </p>
    </div>
  </header>

  <nav class="contents" aria-label="Sections">
    <ol class="contents-list">
      <li v-for="item in NAV" :key="item.id">
        <a class="contents-link" :class="{ 'is-current': active === item.id }" :href="`#${item.id}`" :title="item.hint" @click="go(item.id)">{{ item.label }}</a>
      </li>
    </ol>
  </nav>

  <transition name="drop">
    <div v-if="open" class="mast-drawer">
      <button v-for="item in NAV" :key="item.id" class="drawer-row" @click="go(item.id)">
        <strong>{{ item.label }}</strong><span>{{ item.hint }}</span>
      </button>
      <button class="press press-small" @click="emit('connect'); open = false">
        <Glyph kind="wallet" /> {{ wallet || 'Connect wallet' }}
      </button>
    </div>
  </transition>
</template>
