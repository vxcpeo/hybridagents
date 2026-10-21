<script setup>
/**
 * Cover of the folio: brand, running status, the vertical index and the
 * wallet / menu controls. Replaces the masthead + index-line shell.
 */
import { computed, ref } from 'vue'
import SealMark from './SealMark.vue'
import Icon from './Icon.vue'
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
  <aside class="foil-cover">
    <button class="foil-brand" aria-label="Back to top" @click="go('top')">
      <span class="foil-brandmark"><SealMark :size="28" /></span>
      <span>
        <strong class="foil-wordmark">{{ BRAND.wordmark }}</strong>
        <em class="foil-domain">{{ BRAND.domain }}</em>
      </span>
    </button>

    <p class="foil-status" :title="`Program ${BRAND.programId}`">
      <span class="foil-statusdot" aria-hidden="true"></span>
      <span>{{ BRAND.chain }} / {{ BRAND.cluster }}</span>
      <span class="foil-slot">#{{ slotText }}</span>
    </p>

    <nav class="foil-index" aria-label="Sections">
      <ol class="foil-indexlist">
        <li v-for="item in NAV" :key="item.id" class="foil-indexitem">
          <a class="foil-indexlink" :class="{ 'is-active': active === item.id }" :href="`#${item.id}`"
             :title="item.hint" @click="go(item.id)">{{ item.label }}</a>
        </li>
      </ol>
    </nav>

    <div class="foil-live">
      <p class="foil-liverow">
        <span class="foil-livevalue"><Icon kind="pulse" /> height</span>
        <span class="foil-livevalue">{{ heightText }}</span>
      </p>
      <p class="foil-liverow">
        <span class="foil-livevalue"><Icon kind="pulse" /> {{ online.toLocaleString('en-US') }} agents online</span>
      </p>
      <p class="foil-liverow"><span class="foil-livevalue">epoch 4471</span></p>
      <p class="foil-liverow"><span class="foil-livevalue">median settle 412 ms</span></p>
      <p class="foil-liverow"><span class="foil-livevalue is-live">all systems nominal</span></p>
    </div>

    <div class="foil-tools">
      <button class="foil-connect" @click="emit('connect')">
        <Icon kind="wallet" />
        <span>{{ wallet || 'Connect' }}</span>
      </button>
      <button class="foil-menu" :aria-expanded="open" aria-label="Toggle menu" @click="open = !open">
        <Icon :kind="open ? 'close' : 'menu'" />
      </button>
    </div>

    <svg class="foil-watermark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="31" cy="31" r="21" fill="none" stroke="currentColor" stroke-width="1.6" />
      <path d="M38 38 L51.5 51.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M22.8 32.2 L29 38.4 L41.2 25.6" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" />
    </svg>

    <transition name="drop">
      <div v-if="open" class="foil-drawer">
        <button v-for="item in NAV" :key="item.id" class="foil-drawerrow" @click="go(item.id)">
          <strong class="foil-drawerlabel">{{ item.label }}</strong>
          <span class="foil-drawerhint">{{ item.hint }}</span>
        </button>
        <button class="foil-connect" @click="emit('connect'); open = false">
          <Icon kind="wallet" /> {{ wallet || 'Connect wallet' }}
        </button>
      </div>
    </transition>
  </aside>
</template>
