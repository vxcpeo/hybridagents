<script setup>
/** Telemetry rail: the five live readings that used to sit in the cover rail. */
import { computed } from 'vue'
import OrbGlyph from './OrbGlyph.vue'

const props = defineProps({
  blockHeight: { type: Number, default: 0 },
  online: { type: Number, default: 0 }
})

const heightText = computed(() => props.blockHeight.toLocaleString('en-US'))
</script>

<template>
  <div class="ab-telemetry">
    <p class="ab-tel-cell">
      <OrbGlyph kind="pulse" />
      <span class="ab-tel-key">height</span>
      <b class="ab-tel-num">{{ heightText }}</b>
    </p>
    <p class="ab-tel-cell">
      <OrbGlyph kind="pulse" />
      <span>{{ online.toLocaleString('en-US') }} agents online</span>
    </p>
    <p class="ab-tel-cell ab-tel-cell--quiet">epoch 4471</p>
    <p class="ab-tel-cell ab-tel-cell--quiet">median settle 412 ms</p>
    <p class="ab-tel-cell ab-tel-cell--live">
      <i class="ab-beacon" aria-hidden="true"></i>
      <span>all systems nominal</span>
    </p>
  </div>
</template>
