<script setup>
/**
 * The orbital dock: five route nodes set on a ring that floats over the lower
 * right corner on wide screens. Once the reader leaves the opening statement the
 * ring retracts to a single hub so it never covers the instruments underneath;
 * opening the hub shows the labelled drawer. Small screens get a bottom bar of
 * nodes plus the same drawer.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import OrbGlyph from './OrbGlyph.vue'
import CoventMark from './CoventMark.vue'
import { NAV } from '../brand'

defineProps({
  active: { type: String, default: 'network' },
  wallet: { type: String, default: '' }
})
const emit = defineEmits(['navigate', 'connect'])

const open = ref(false)
const condensed = ref(false)
const wide = typeof window !== 'undefined' ? window.matchMedia('(min-width: 901px)') : null

function onScroll() {
  condensed.value = Boolean(wide?.matches) && window.scrollY > 340
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

function go(id) {
  open.value = false
  emit('navigate', id)
}

function angle(index) {
  return `${(index * 360) / NAV.length - 90}deg`
}
</script>

<template>
  <nav class="ab-dock" :class="{ 'ab-dock--compact': condensed, 'ab-dock--open': open }" aria-label="Sections">
    <div class="ab-dial" aria-hidden="true">
      <span class="ab-dial-track"></span>
      <span class="ab-dial-hub"><CoventMark :size="20" /></span>
    </div>

    <ul class="ab-nodes">
      <li v-for="(item, i) in NAV" :key="item.id" class="ab-node" :style="{ '--ab-angle': angle(i) }">
        <a class="ab-node-link" :class="{ 'ab-node-link--lit': active === item.id }" :href="`#${item.id}`"
           :title="item.hint" :aria-current="active === item.id ? 'location' : undefined" @click="go(item.id)">
          <span class="ab-node-dot" aria-hidden="true"></span>
          <span class="ab-node-label">{{ item.label }}</span>
        </a>
      </li>
    </ul>

    <button class="ab-dock-toggle" :aria-expanded="open" aria-label="Toggle menu" @click="open = !open">
      <CoventMark v-if="condensed" :size="24" />
      <OrbGlyph v-else :kind="open ? 'close' : 'menu'" />
    </button>

    <transition name="drop">
      <div v-if="open" class="ab-drawer">
        <button v-for="item in NAV" :key="item.id" class="ab-drawer-row" @click="go(item.id)">
          <strong class="ab-drawer-label">{{ item.label }}</strong>
          <span class="ab-drawer-hint">{{ item.hint }}</span>
        </button>
        <button class="ab-wallet" @click="emit('connect'); open = false">
          <OrbGlyph kind="wallet" /> {{ wallet || 'Connect wallet' }}
        </button>
      </div>
    </transition>
  </nav>
</template>
