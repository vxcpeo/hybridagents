<script setup>
/**
 * Top HUD: brand orb, the program status line, the X link and the wallet
 * control. Replaces the old cover-rail masthead; the navigation no longer
 * lives here (see OrbitDock).
 */
import { computed } from 'vue'
import CoventMark from './CoventMark.vue'
import OrbGlyph from './OrbGlyph.vue'
import SocialXGlyph from './SocialXGlyph.vue'
import { BRAND } from '../brand'

const props = defineProps({
  wallet: { type: String, default: '' },
  blockHeight: { type: Number, default: 0 }
})
const emit = defineEmits(['navigate', 'connect'])

const slotText = computed(() => (291884000 + props.blockHeight).toLocaleString('en-US'))

function go(id) {
  emit('navigate', id)
}
</script>

<template>
  <header class="ab-hud">
    <div class="ab-hud-wrap">
      <button class="ab-brand" aria-label="Back to top" @click="go('top')">
        <span class="ab-brand-mark"><CoventMark :size="24" /></span>
        <span class="ab-brand-copy">
          <strong class="ab-brand-word">{{ BRAND.wordmark }}</strong>
          <em class="ab-brand-domain">{{ BRAND.domain }}</em>
        </span>
      </button>

      <p class="ab-hud-status" :title="`Program ${BRAND.programId}`">
        <span class="ab-beacon" aria-hidden="true"></span>
        <span class="ab-hud-chain">{{ BRAND.chain }} / {{ BRAND.cluster }}</span>
        <span class="ab-hud-slot">#{{ slotText }}</span>
      </p>

      <div class="ab-hud-actions">
        <a class="ab-hud-x" :href="BRAND.x" target="_blank" rel="noreferrer noopener"
           :title="`${BRAND.handle} on X`" :aria-label="`Coventa on X (${BRAND.handle})`">
          <SocialXGlyph :size="11" />
          <span class="ab-hud-handle">{{ BRAND.handle }}</span>
          <OrbGlyph kind="external" />
        </a>
        <button class="ab-hud-wallet" @click="emit('connect')">
          <OrbGlyph kind="wallet" />
          <span class="ab-hud-wallettext">{{ wallet || 'Connect' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
