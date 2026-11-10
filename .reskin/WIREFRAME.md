# Wireframe commitment — Abyss Liquidity / Orbital

Selected by `choose-style.mjs` (`.reskin/style.json`, `.reskin/STYLE.md`). This file is the
implementation contract for phase 2. No alternative direction is allowed.

## Shell

`src/App.vue` renders **`AbyssShell`**: a fixed top HUD, a fixed orbital dock (the navigation
dial), the scrolling stage (`main`), and a floor (`footer role=contentinfo`).

```
.app-void                        (page ground: abyss gradient + grid + slow sweep)
  AbyssHeader   <header>         brand orb · telemetry line · X · wallet
  TelemetryRail                 5 HUD cells on a hairline track (height, online, epoch, settle, status)
  OrbitDock     <nav>            circular dial, 5 nodes on a ring; mobile: toggle + drop drawer
  main.stage
    OrbitCore   #top             centred reactor: kicker, h1, lede, actions, program pill, topology arc
    OrbitRail                   4 stat nodes on a horizontal orbit line
    NetworkOrbit     #network    panel row: measure (chart) + settlement tape; metrics rail
    RegistryOrbit    #registry   toolbar (2 rows) + 3-column constellation of record cards
    LedgerOrbit      #ledger     receipts panel (left) + activity rail (right)
    VaultOrbit       #vault      gauge + tallies + stake capsule; ballots as 3-up row
    ConsoleOrbit     #console    terminal + registration capsule, side by side
  AbyssFloor   <footer>          centred mark, link row, base rail
  WalletHud    dialog            docket, name="drawer"
  toast                          name="toast"
```

Landmark sequence changes from `aside, nav, main, div[contentinfo]` to
`header, nav, main, footer` — the left sidebar and its numbered index are gone. Navigation
moves from a sticky vertical index panel to a floating circular dial pinned to the lower
right (mobile: a single toggle and a drop drawer).

## Route mapping (single static route `/`)

| Region | Old composition | New composition |
|---|---|---|
| brand + status | sticky cover rail, left column | glass HUD strip across the top; status becomes a telemetry rail beneath it |
| navigation | numbered vertical index inside the cover | orbit dial: five nodes placed on a 240 px circle, active node gets a lit ring |
| hero | left headline + right engraved dial plate + 4-col figure row | centred reactor: 620 px concentric ring stack behind a centred headline, topology arc across the lower circle, program pill on the ring's base, figures lifted onto a separate orbit rail |
| network | measure plate + tape register, indicators in a 2×2 ruled grid | two glass panels side by side (chart / tape), four metric capsules on a horizontal rail |
| registry | two-column index of ruled rows | one search row over a lane/sort row, then a 3-column constellation of record cards with circular monograms and arc meters |
| ledger | full-width receipt sheet, 3-column bulletin beneath | receipts panel beside a vertical activity rail, detail expands in place |
| vault | staking leaf beside ballot sheet | conic utilisation gauge + tallies + stake capsule across the top, ballots as a 3-up row below |
| console | transcript band above a 2-col questionnaire | terminal panel beside the registration capsule in one framed desk |
| footer | 4-column imprint strip | centred mark and tagline, three link columns, base rail with a counter-rotating arc |

## Components

Kept as content-only children (rewritten markup, same data): none from `src/folio/` — every
file there is presentation and is replaced.

Added (new names, new classes):

- `src/orbit/AbyssHeader.vue` — brand, telemetry, wallet, X link
- `src/orbit/TelemetryRail.vue` — the five HUD readings
- `src/orbit/OrbitDock.vue` — circular nav + mobile drawer + wallet row
- `src/orbit/OrbitCore.vue` — hero statement, actions, program pill
- `src/orbit/CoreFigure.vue` — decorative topology arc (aria-hidden)
- `src/orbit/OrbitRail.vue` — the four opening figures
- `src/orbit/NetworkOrbit.vue`, `RegistryOrbit.vue`, `LedgerOrbit.vue`, `VaultOrbit.vue`, `ConsoleOrbit.vue`
- `src/orbit/AbyssFloor.vue`, `WalletHud.vue`, `CoventMark.vue`, `OrbGlyph.vue`, `GlyphField.vue`
- `src/styles/abyss.css` — single global stylesheet (tokens, reset, shell, components, breakpoints, motion guards)

Deleted from the render path and from disk: `src/folio/*`, `src/styles/folio.css`.

## Tokens and breakpoints

`abyss.css` defines `--ab-*` custom properties (no old token names survive): ground
`#04060a`, deck `#0a0f16`, panel `#111a24`, line `#22303d`, ink `#f4f7fa`, ink-soft
`#c3d2df`, mute `#9db0c2`, accent `#ff2f2f`, accent text `#ff6b6b`, accent2 `#ff00ff`,
success `#5ce1a0`, danger `#ff7a7a`, warning `#f2c94c`.

Breakpoints: `1180px` (dial shrinks, panels stack), `900px` (all grids collapse to one
column, HUD becomes two rows, dial becomes bottom-right toggle), `560px` (type scale,
gauge and ring sizes).

## Content rules for the build

Every visible text node, attribute, form field, binding and handler is copied verbatim from
the outgoing sources; the `verify.mjs` source contract is the authority. Composite tokens
(`{{ r.ms }}ms`, `-{{ range }}`, `{{ p.yes }}% yes`, `{{ rows.length }} of …`) keep their
adjacency so the rendered word multiset is unchanged.
