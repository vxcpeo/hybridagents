# Wireframe commitment — Settlement Folio

Selected direction: **Paper Protocol** (`ethereum-paper`, live sampled from
https://ethereum.org) with the **Split-Stage** shell rather than the selector's
default `documentary` suggestion, because the outgoing site *is* a documentary
gazette (masthead + index line + 7/3 body). Repeating it would keep the original
skeleton. The stage keeps the paper DNA and changes the information architecture.

## Shell

`FolioCover` (sticky left rail, `aside`) + `.foil-column` (`main` + `imprint`
`div[role=contentinfo]`). The whole page is one static route `/`; the five
chapters are sections inside `main`, each with an `id` used by the rail index.

| Region | Old (gazette) | New (folio) |
| --- | --- | --- |
| Navigation | index line under the masthead, horizontal | numbered vertical index in the sticky cover; horizontal scroll strip on mobile |
| Brand | masthead wordmark + band | seal + wordmark + domain in the cover |
| Status | run strip under the wordmark | live facts block under the index |
| Hero | full-width headline, deck, marginal diagram, figures row | overture inside the scrolling stage: headline, drop-cap lede, ruled figures, engraved plate |
| Chapter head | `dispatch-head` (number + title + note, side by side) | vertical chapter mark in the left margin + title + note in the text column |
| Footer | `footer` landmark with 4 columns | `role=contentinfo` imprint strip |

## Route composition

`/` — cover rail (brand, index, live facts, connect) → overture (`#top`) →
`#network` (throughput plate + settlement tape + indicator fact sheet) →
`#registry` (controls + two-column ruled entries) → `#ledger` (receipt sheet +
three-column agent bulletin) → `#vault` (stake leaf + council ballot sheet) →
`#console` (transcript band + typeset questionnaire) → imprint.

Mobile (≤960 px): the cover becomes a static header; the index becomes a
horizontal scroll strip; the stage stacks to one column; the chapter mark turns
horizontal; the receipt table folds its hash column (≤820 px) and its slot column
(≤620 px) exactly where the old layout folded them, so the rendered word multiset
stays identical at the verification viewport.

## Components

Deleted (old presentation layer): `src/journal/Masthead.vue`, `FrontPage.vue`,
`LoadDispatch.vue`, `RegistryLedger.vue`, `ReceiptLedger.vue`, `StakeBureau.vue`,
`RegistrationDesk.vue`, `Colophon.vue`, `WalletSheet.vue`, `MastMark.vue`,
`Glyph.vue`, `GlyphSprite.vue`, `TopologyDiagram.vue`, plus
`src/styles/journal.css` (no longer imported).

Added: `src/folio/FolioCover.vue`, `Overture.vue`, `TopologyPlate.vue`,
`ThroughputChapter.vue`, `RegisterChapter.vue`, `ReceiptsChapter.vue`,
`StakeChapter.vue`, `ConsoleChapter.vue`, `Imprint.vue`, `WalletSlip.vue`,
`SealMark.vue`, `Icon.vue`, `IconSprite.vue`, plus `src/styles/folio.css`
(single stylesheet: tokens, reset, shell, components, breakpoints, motion).

Rewired: `src/App.vue` (same state, handlers, observer, ticker, toast and wallet
flow), `src/main.js` (imports `styles/folio.css` only). `src/brand.js` and
`src/lib/solana.js` untouched.

## Tokens and breakpoints

Tokens live in `:root` of `folio.css` under a new vocabulary (`--paper`,
`--sheet`, `--graphite`, `--rule`, `--brand-ink`, `--serif-display`,
`--mono-face`, `--gap-*`, `--edge`, `--cover`) so no old token name survives.
Breakpoints: 1180 px (stage grids collapse), 960 px (cover becomes header),
820 px (receipt hash column folds), 620 px (single column, slot column folds).
