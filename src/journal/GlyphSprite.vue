<script setup>
/** One hidden symbol sheet for every decorative glyph on the page. */
const PATHS = {
  dot: ['M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  pulse: ['M3 12h4l2.2-5.4 3.6 10.8L15 12h6'],
  arrow: ['M4 12h15', 'M13 6l6 6-6 6'],
  play: ['M9 6.5l9 5.5-9 5.5z'],
  wallet: ['M3 8h15a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z', 'M3 8V6a2 2 0 0 1 2-2h11', 'M17 13.5h2'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  copy: ['M9 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z', 'M6 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1'],
  filter: ['M4 6.5h16', 'M7 12h10', 'M10 17.5h4'],
  search: ['M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z', 'M16 16l4.5 4.5'],
  refresh: ['M20 12a8 8 0 1 1-2.4-5.7', 'M20 4v5h-5'],
  check: ['M4.5 13l5 5L20 6.5'],
  cross: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14', 'M5 12h14'],
  lock: ['M5.5 11h13v9h-13z', 'M8.5 11V8a3.5 3.5 0 0 1 7 0v3'],
  unlock: ['M5.5 11h13v9h-13z', 'M8.5 11V8a3.5 3.5 0 0 1 7 0'],
  up: ['M12 5v14', 'M6 11l6-6 6 6'],
  down: ['M12 19V5', 'M6 13l6 6 6-6'],
  trend: ['M4 17l6-6.5 4 4 6-8', 'M15 6.5h5v5'],
  vault: ['M4 5h16v14H4z', 'M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
  finger: ['M12 3.5a4 4 0 0 0-4 4V15', 'M12 3.5a4 4 0 0 1 4 4v3', 'M8 15v2.5', 'M12 9v9', 'M16 14v3.5'],
  rocket: ['M12 3.5c4 2.2 6 6 6 10l-3 3H9l-3-3c0-4 2-7.8 6-10z', 'M9.5 19.5l-2 2', 'M14.5 19.5l2 2', 'M12 11v.01'],
  terminal: ['M4 5h16v14H4z', 'M7.5 10l3 3-3 3', 'M13 16.5h3.5'],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5H5V6h5'],
  github: ['M9 21v-3.2c-2 .4-2.7-.8-3-1.8', 'M9 21c-4 1-4.5-2.5-4.5-2.5S3.5 16 3 15.4', 'M15 21v-3.2c1.8.3 2.6-.7 2.9-1.7', 'M12 3.5a8.5 8.5 0 0 0-4.5 15.7', 'M12 3.5a8.5 8.5 0 0 1 4.5 15.7'],
  send: ['M21 3.5L3.5 11l6.5 3 3 6.5z', 'M10 14l3-3'],
  shield: ['M12 3.5l7 2.8v5.9c0 5-3.1 7.8-7 8.8-3.9-1-7-3.8-7-8.8V6.3l7-2.8z', 'M9 12l2 2 4-4'],
  enter: ['M19 5v7a2 2 0 0 1-2 2H6', 'M10 10l-4 4 4 4'],
  alert: ['M12 4l9 16H3z', 'M12 10v4', 'M12 17v.01']
}
</script>

<template>
  <svg class="glyph-sprite" width="0" height="0" aria-hidden="true" focusable="false">
    <symbol v-for="(paths, name) in PATHS" :id="`glyph-${name}`" :key="name" viewBox="0 0 24 24">
      <path v-for="(d, i) in paths" :key="i" :d="d" />
    </symbol>
  </svg>
</template>
