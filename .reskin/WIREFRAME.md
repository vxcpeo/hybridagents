# Wiring plan — Agora Violet / Documentary Ledger

Project: `E:/workspace/chuangye/solana/hybridagents/website` (Vue 3 + Vite, single route `/`).

Selected style: **Agora Violet** (`polygon-agora`, live `https://polygon.technology`).
Selected skeleton: **Documentary Ledger** (`documentary`, editorial family).
Original skeleton: `orbital` (spatial family), dark app-bar + ticker + bento/tiles + neon mint.

## New shell

`src/App.vue` becomes a "gazette" shell:

```
.gazette
├── .gazette-glow              (aria-hidden, fixed violet bloom)
├── Masthead.vue               → <header class="masthead">  + <nav class="contents"> + .mast-drawer
├── <main class="gazette-main">
│   ├── FrontPage.vue          → #top  (lede + figures + diagram margin)
│   ├── LoadDispatch.vue       → #network (01 / network)
│   ├── RegistryLedger.vue     → #registry (02 / registry)
│   ├── ReceiptLedger.vue      → #ledger  (03 / ledger)
│   ├── StakeBureau.vue        → #vault   (04 / economy)
│   └── RegistrationDesk.vue   → #console (05 / console)
├── Colophon.vue               → <footer class="colophon">
├── WalletSheet.vue            → dialog (transition name="drawer" kept)
└── <transition name="toast">  → .notice
```

Landmarks: `header` → `nav` → `main` → `footer`. The five per-section `<header>`
elements, the section `<footer>` and the stream `<aside>` from the old skeleton
are gone (replaced by ruled `div` heads, a ruled tally line and a plain
`div.broadside`). Section heads are no longer landmarks.

## Route composition (`/` only)

| Region | Old skeleton | New composition |
|---|---|---|
| Navigation | sticky `bar` with pill buttons, hamburger drawer, ticker strip | masthead issue line + wordmark + run line, then a ruled **index line** of numbered anchors; contents drawer keeps the `drop` transition and the same handler set |
| Hero | two-column hero + KPI strip + orbital SVG | full-width editorial **lede**: kicker + display headline across the measure, then lede/CTAs/program line in the 7-column deck, topology figure in the 3-column margin, ruled figure table across both columns, note underneath |
| Network | 12-col bento of tiles + ring chart + tape | 7/3 **documentary body**: throughput panel left, indicator table + settlement tape on ledger rules |
| Registry | 3-col card grid | ruled **agent register**: search line, lane/sort index row, one ledger row per agent (sigil, name, state, capability run, success/stake measures, metadata gutter, two actions), ruled tally line |
| Ledger | split panel + stream aside | receipt log with ruled expandable rows + activity broadside in margin |
| Vault | vault panel + council panel | stake ledger (figure + fields) beside council ballots |
| Console | terminal + form panels | transcript column beside a typeset questionnaire |
| Footer | 4-col footer with 3 `<nav>` columns | colophon with mast, three link columns, ruled base line |

## Content handling

Every visible string, placeholder, title, aria-label, binding expression, event
handler and form field is moved verbatim. Section kickers (`01 / network` …)
become the numbered section index. No new visible copy is introduced; decorative
glyphs are aria-hidden inline SVG (`Glyph.vue`) so the old lucide class tokens
disappear with the old icon set.

## Components

Deleted: `src/components/TopNav.vue`, `Hero.vue`, `NetworkBento.vue`,
`NetworkOrb.vue`, `AgentRegistry.vue`, `LedgerSection.vue`, `VaultCouncil.vue`,
`ConsoleSection.vue`, `SiteFooter.vue`, `WalletDrawer.vue`, `BrandMark.vue`,
`src/styles/base.css`, `src/styles/tokens.css`.

Added: `src/journal/{Masthead,FrontPage,TopologyDiagram,LoadDispatch,RegistryLedger,ReceiptLedger,StakeBureau,RegistrationDesk,Colophon,WalletSheet,MastMark,Glyph}.vue`
and `src/styles/journal.css` (the only global stylesheet, imported by `main.js`).

Kept as content-only: `src/brand.js`, `src/lib/solana.js` (unchanged).

## Tokens & breakpoints

`journal.css` carries the Agora Violet tokens (`--bg:#000`, violet accent
`#670de5`, accent-safe `#9f45ff`, accent-2 `#A97BFF`, ink `#F2F3F7`, hairline
`#2B2930`), grotesque display type at weight 520 with negative tracking, mono
metadata, 2px radii, hairline rules and no glows/cards.

Breakpoints: 1180px (body 7/3 → 1 col with margin moved above), 820px
(masthead stacks, index wraps, registers become blocks), 560px (single column,
figures fold, ruled rows stack). No horizontal rails, no clipped content.
