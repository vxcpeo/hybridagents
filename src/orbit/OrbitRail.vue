<script setup>
/** The four opening figures, lifted onto their own orbit line under the core. */
defineProps({
  stats: { type: Array, default: () => [] }
})
</script>

<template>
  <dl class="ab-rail">
    <div v-for="s in stats" :key="s.k" class="ab-rail-cell">
      <dt class="ab-rail-key">{{ s.k }}</dt>
      <dd class="ab-rail-val">{{ s.v }}</dd>
      <span class="ab-rail-sub">{{ s.sub }}</span>
    </div>
  </dl>
</template>
