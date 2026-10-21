# Reskin report — Quittra Settlement Folio

Project: `E:/workspace/chuangye/solana/hybridagents/website` (Vue 3.5 + Vite 6, single static route `/`)
Result: **PASS** — `node scripts/verify.mjs check --project . --out .reskin --port 4419` exits 0 with 0 blocking issues and 0 warnings.

> The UI was rebuilt around **Paper Protocol** / **Split Stage**; the original **documentary gazette** shell and palette were removed while the content contract stayed byte-for-byte intact.

## 1. Selected direction

| | |
|---|---|
| Style | **Paper Protocol** (`ethereum-paper`, crypto-editorial) |
| Source DNA | https://ethereum.org — live sampled, 3078 ms |
| Live sampling | 8 of 10 blockchain references returned; `arbitrum.io` gave HTTP 403 and `sui.io` timed out, both fell back to the bundled catalog |
| Skeleton | **Split Stage** (`split-stage`) — chosen over the selector's `documentary` default because the outgoing site already was a documentary gazette |
| Original | `terminal-console` per the inventory classifier; in practice the previous agent had built a documentary gazette (masthead, index line, 7/3 ledger body) |
| New accent | `#083f60` — **100.61 ΔE** from `#670de5` (threshold 30) |
| Type | Georgia for display and body (Palatino / Times fallbacks), Courier New for figures, labels and on-chain strings; all system faces |
| Tokens | `--paper:#f6f2e8`, `--sheet:#fffdf6`, `--graphite:#15161a`, `--rule:#cfc6b3`, `--brand-ink:#0c5681`, `--brand-deep:#083f60`, 0–2 px corners, hairline rules, no shadows |

Selection evidence: `.reskin/style.json`, `.reskin/STYLE.md`, ranking table (Paper Protocol 0.9138, next best Signal Navy 0.9052).

## 2. How the skeleton changed

| Region | Original | Reskin |
|---|---|---|
| Shell | sticky masthead at the top, index line beneath, single scrolling column | sticky **cover rail** on the left (`aside`) + scrolling folio stage on the right |
| Landmarks | `header, nav, main, footer` (4) | `aside, nav, main, div[role=contentinfo]` — the top banner landmark is gone; landmark LCS 0.50 |
| Navigation | horizontal index line of anchors under the wordmark | numbered vertical index inside the cover (decimal-leading-zero markers), active entry gets a navy spine; on mobile it becomes a horizontal scroll strip plus the existing drawer |
| Hero | full-width headline, deck, marginal topology, figures row | overture inside the stage: headline with italic accent, drop-cap lede, ruled figure row, engraved dial plate |
| Chapter heads | number + title + note in one row | vertical chapter mark in the left margin (`01 / network`), title + note in the text column |
| Network | chart + tape side by side, indicators table in the margin | measure plate + tape register, indicator fact sheet as a 2×2 ruled grid below |
| Registry | one ruled row per agent (full width) | two-column index of ruled entries with monogram tiles, meters and a meta line |
| Ledger | receipt table left, activity stream right | full-width receipt sheet + three-column agent bulletin below it |
| Vault | stake panel beside ballot column | stake leaf (utilisation bar, 2×2 tallies, stepper) beside a ballot sheet with quorum ticks |
| Console | transcript left, form right | full-width transcript band above a two-column typeset questionnaire |
| Footer | 4-column footer landmark | `role=contentinfo` imprint strip with seal, three link columns and a ruled base line |

Hard numbers from the checker: DOM fingerprint similarity **0.261** (limit 0.50), landmark similarity **0.500** (limit 0.68), rendered CSS class overlap **0.016** (limit 0.10) — the single shared token is an incidental state hook, no structural class from the old shell survives.

## 3. Verification

`.reskin/VERIFICATION.md` / `.reskin/verification.json`, generated 2026-10-21T17:26:36Z against `http://127.0.0.1:4419/`.

| Gate | Threshold | Result |
|---|---|---|
| Source content contract | no removals/changes | **PASS** — 0 issues, 0 warnings |
| Route renders | 200, no console/page errors | **PASS** — `/` 200, 0 console errors, 0 page errors |
| Rendered visible words | multiset parity | **PASS** — 444 words, no missing/added token |
| Rendered attributes | multiset parity | **PASS** — placeholders, titles, aria-labels unchanged |
| Form fields | multiset parity | **PASS** — 6 inputs + 1 textarea |
| DOM fingerprint | ≤ 0.50 | **PASS** — 0.261 |
| Landmark sequence | ≤ 0.68 | **PASS** — 0.500 |
| CSS class overlap | ≤ 0.10 | **PASS** — 0.016 |
| Accent distance | ≥ 30 ΔE | **PASS** — 100.61 ΔE (`#670de5` → `#083f60`) |
| Contrast (1440 × 900 / 390 × 844) | 0 failures | **PASS** — 0 / 360 desktop, 0 mobile |
| Axe WCAG 2.x | 0 serious/critical | **PASS** — 0 serious, 0 moderate |
| Horizontal overflow @390 | none | **PASS** — scrollWidth = clientWidth, 0 offenders |
| Mobile navigation | reachable | **PASS** — 5 visible index links + drawer toggle |
| Keyboard focus | visible indicator | **PASS** — 2 px navy outline on every tab sample |
| Labels / alt text | no issues | **PASS** — 0 field issues, 0 interactive issues, 0 image issues |

Content contract hash: `c3e0f24e23cb` on both baseline and current; rendered word/attribute/form multisets are identical (65 numeric tokens, 80 total).

## 4. Behaviour verified in a real browser

`.reskin/interactions.mjs` (CDP + installed Chrome, desktop 1440 and mobile 390) — **21/21 checks pass**:

rail anchors update the hash and scroll; registry search filters to one agent; lane filter isolates the idle agent; success sort ranks the 99.9 % agent first; failed receipts isolate to one row and expand to `input_hash`/`output_hash`; the wallet slip opens, shows the signature rows, approves and closes with the connected label and toast; a council vote flips to “voted yes” + “recorded”; the stake stepper increments 250 → 300; the registration form writes a result line into the transcript; mobile drawer opens with five rows and the page has no horizontal overflow; **0 runtime errors** throughout.

## 5. Accessibility and responsive

- One `h1` (the overture statement), one `h2` per chapter, one `h3` per agent entry — 12 headings, no skipped levels.
- `aside` (cover), `nav` (Sections), `main`, `div[role=contentinfo]` landmarks; the wallet slip is a named modal dialog; every control carries an accessible name (the two icon-only controls use `aria-label`).
- Body copy ≥ 15 px at ≥ 4.5:1; metadata uses `--graphite-3` (#5d5c55, 5.6:1 on paper) and accent text uses `--brand-deep` (#083f60, 8.4:1) rather than the lighter fill navy.
- 390 px: one linear column, cover becomes a header, index scrolls horizontally, chapters stack, figures collapse to one column; the receipt hash folds at ≤820 px and the receipt slot at ≤620 px — the same folds the old layout used, which is what keeps the mobile word multiset identical to the baseline.
- Motion is limited to an entry rise, a slow plate rotation and a blinking cursor, all inside `@media (prefers-reduced-motion: no-preference)` with a global reduce guard.
- `:focus-visible` is defined globally (2 px `--brand-ink`, 3 px offset); the search field and stepper show a navy ring on focus-within.

## 6. Files changed

Removed (old presentation layer):

- `src/journal/` — `Masthead.vue`, `FrontPage.vue`, `LoadDispatch.vue`, `RegistryLedger.vue`, `ReceiptLedger.vue`, `StakeBureau.vue`, `RegistrationDesk.vue`, `Colophon.vue`, `WalletSheet.vue`, `MastMark.vue`, `Glyph.vue`, `GlyphSprite.vue`, `TopologyDiagram.vue`
- `src/styles/journal.css` (old global stylesheet; no longer imported)

Added (new presentation layer):

- `src/styles/folio.css` — the single global stylesheet (tokens, reset, shell, all components, breakpoints, motion guards)
- `src/folio/FolioCover.vue`, `Overture.vue`, `TopologyPlate.vue`, `ThroughputChapter.vue`, `RegisterChapter.vue`, `ReceiptsChapter.vue`, `StakeChapter.vue`, `ConsoleChapter.vue`, `Imprint.vue`, `WalletSlip.vue`, `SealMark.vue`, `Icon.vue`, `IconSprite.vue`

Rewired:

- `src/App.vue` — new folio shell; state, handlers, observer, ticker, toast and wallet logic unchanged
- `src/main.js` — imports `styles/folio.css` only

Untouched content sources: `src/brand.js`, `src/lib/solana.js`, `index.html` (title, description, lang unchanged).

A pre-edit snapshot of the outgoing site is kept at `.reskin/original-site/` (the project has no git repository) alongside the frozen `.reskin/baseline/` evidence.

## 7. Screenshots

| Viewport | Baseline | Reskin |
|---|---|---|
| 1440 × 900 (full page) | [baseline/home-desktop.png](baseline/home-desktop.png) | [current/home-desktop.png](current/home-desktop.png) |
| 390 × 844 (full page) | [baseline/home-mobile.png](baseline/home-mobile.png) | [current/home-mobile.png](current/home-mobile.png) |

Side-by-side review: the baseline reads as a dark violet newspaper (black stock, masthead, index line, glowing type); the reskin reads as a warm paper protocol folio (cream stock, navy ink, sticky cover rail with a numbered index, ruled registers, engraved dial and seal). They share no navigation placement, no card/grid silhouette, no accent family and no typographic system.

## 8. Known limitations

- Only one static route exists (`/`); no dynamic routes were skipped.
- The style selector's own skeleton suggestion was `documentary`; the implemented shell is **Split Stage**. Rationale is recorded in `.reskin/WIREFRAME.md`: the outgoing site was already documentary, so following the suggestion would have failed the “original archetype is gone” rule.
- The inventory classifier reports the old archetype as `terminal-console` (linear) because the locked content includes the word “terminal” and a console transcript; the structural gates measure the actual markup, and the fingerprint dropped to 0.261.
- The four `name` attributes on Vue `<transition>` (`drop`, `expand`, `drawer`, `toast`) are content-locked, so those transition names remain; the transition CSS itself is new (`folio.css`), not imported from the old stylesheet.
- The self-hosted font files in `public/fonts/` are no longer referenced by the stylesheet (the paper direction uses system Georgia / Courier New); they are left on disk, unimported, and listed here rather than deleted mid-run.
- The settlement tape's hash cell stays visually hidden at every width, as in the baseline, so the rendered word multiset matches at both verification viewports; every hash remains visible in its receipt row and in the expanded receipt detail.
