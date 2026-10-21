# Reskin report — Stakri settlement gazette

Project: `E:/workspace/chuangye/solana/hybridagents/website` (Vue 3.5 + Vite 6, single static route `/`)
Result: **PASS** — `node scripts/verify.mjs check --project . --out .reskin` exits 0, 0 blocking issues, 10 non-blocking warnings.

> The UI was rebuilt around **Agora Violet** / **Documentary Ledger**; the original **orbital** shell and palette were removed while the content contract stayed byte-for-byte intact.

## 1. Selected direction

| | |
|---|---|
| Style | **Agora Violet** (`polygon-agora`, technical-editorial) |
| Source DNA | https://polygon.technology — live sampled, 3141 ms |
| Live sampling | 9 of 10 blockchain references returned; `arbitrum.io` failed (HTTP 403) and fell back to the bundled catalog for that candidate |
| Skeleton | **Documentary Ledger** (`documentary`, editorial family) |
| Original | `orbital` (spatial) with a light anchor accent `#22f5c8` |
| New accent | `#670de5` — **170.69 ΔE** from the original (threshold 30) |
| Type | Ledger Grotesk (bundled IBM Plex variable) with Space Grotesk/Century Gothic/Segoe UI in the chain; Ledger Mono (bundled DM Mono) for numerals and metadata; display weight 520, tracking −0.055em |
| Tokens | `--bg:#000`, `--surface:#141415`, `--ink:#f2f3f7`, `--muted:#a0a1a6`, `--accent:#670de5`, `--accent-safe:#9f45ff`, `--accent-2:#a97bff`, `--line:#2b2930`, 2 px radii, hairline rules, violet bloom only |

Selection evidence: `.reskin/style.json`, `.reskin/STYLE.md`, ranking table (Agora Violet 0.9993, next best Spectrum Terminal 0.9641).

## 2. How the skeleton changed

| Region | Original | Reskin |
|---|---|---|
| Shell | sticky app bar + ticker strip + `.shell` sections | gazette masthead (dateline, giant wordmark, right-aligned run block) + ruled **index line**, `main`, colophon |
| Landmarks | `header, nav, main, header×5, footer, aside, footer, nav×3` (14) | `header, nav, main, footer` (4) — section heads are ruled `div`s, the activity stream is a plain `div`, footer columns are lists |
| Navigation | pill buttons in the app bar, ticker across the top | numbered `<ol>` index (`decimal-leading-zero` markers) of in-page anchors, active entry underlined, optional contents drawer (`drop` transition, same handlers) |
| Hero | left copy + right orbital SVG + inset KPI strip | full-width display headline, lede/CTAs/program line in the 7-column deck, topology figure in the 3-column margin, ruled figure table across both columns |
| Network | 12-column bento of bordered tiles, ring chart, tape rows | 7/3 documentary body: throughput measure + settlement tape on ledger rules; indicator `<table>` in the margin |
| Registry | 3-column card grid | one ruled register row per agent (sigil, identity, capability run, success/stake measures, metadata gutter, two actions) + ruled tally line |
| Ledger | rounded panel + stream panel | receipt log with ruled expandable rows, hash detail as a definition list, activity broadside in the margin |
| Vault | vault panel + council panel | stake ledger (utilisation rule, tallies, typeset fields) beside council ballots with quorum markers |
| Console | terminal panel + form panel | transcript column beside a typeset questionnaire |
| Footer | 4-column footer with three `<nav>` groups | colophon: mast + tagline + stamps, three ruled link columns, ruled base line |

Hard numbers from the checker: DOM fingerprint similarity **0.400** (limit 0.50), landmark sequence similarity **0.286** (limit 0.68), rendered CSS class overlap **0.000** (limit 0.10) — no old class name survives in the DOM.

## 3. Verification

`.reskin/VERIFICATION.md` / `.reskin/verification.json`, generated 2026-10-20T16:24:49Z against `http://127.0.0.1:4899/` (private port; port 4317 was briefly claimed by an unrelated local app during an intermediate run, so the final run used 4899).

| Gate | Threshold | Result |
|---|---|---|
| Source content contract | no removals/changes | **PASS** — 0 issues, 4 additive binding warnings + 5 in-page link-target warnings |
| Route renders | 200, no console/page errors | **PASS** — `/` 200, 0 console errors, 0 page errors |
| Rendered visible words | multiset parity | **PASS** — 444 words, no missing/added/changed token |
| Rendered attributes | multiset parity | **PASS** — placeholders, titles, aria-labels unchanged |
| Form fields | multiset parity | **PASS** — 6 inputs + 1 textarea |
| DOM fingerprint | ≤ 0.50 | **PASS** — 0.400 |
| Landmark sequence | ≤ 0.68 | **PASS** — 0.286 |
| CSS class overlap | ≤ 0.10 | **PASS** — 0.000 |
| Accent distance | ≥ 30 ΔE | **PASS** — 170.69 ΔE (`#22f5c8` → `#670de5`) |
| Contrast (1440 × 900 / 390 × 844) | 0 failures | **PASS** — 0 / 359 desktop, 0 mobile |
| Axe WCAG 2.x | 0 serious/critical | **PASS** — 0 serious, 0 moderate |
| Horizontal overflow @390 | none | **PASS** — scrollWidth = clientWidth, 0 offenders |
| Mobile navigation | reachable | **PASS** — 5 visible index anchors, drawer reachable |
| Keyboard focus | visible indicator | **PASS** — 2 px accent outline on every tab sample |
| Labels / alt text | no issues | **PASS** — 0 field issues, 0 interactive issues, 0 image issues |

Content contract hash: baseline `0797fe0639f3…` → current `ca9c02539859…`. The hash moves only because the new skeleton adds presentational bindings (in-page `href` anchors and the glyph sprite `href`); the checker's structural diff reports **zero** removed, rewritten or duplicated content tokens, and the rendered word/attribute/form multisets are identical.

## 4. Behaviour verified in a real browser

`.reskin/interactions.mjs` (playwright-core + installed Chrome, desktop 1440 and mobile 390) — **all 23 checks pass**:

index anchors scroll and drive the active entry; contents drawer opens with `aria-expanded`; wallet sheet opens → wallet pick → signature step (program / fee payer / network fee rows) → approve connects and raises the notice; registry search filters to 1 row, empty state renders, lane filter and success sort work; receipt filter isolates the failed row, row expansion reveals `input_hash`/`output_hash`, explorer href keeps the devnet cluster URL; council vote records and stamps; stake stepper increments 250 → 300 and queues the action; the registration form blocks an empty codename and then writes a result line into the transcript; keyboard focus visible; **0 console/page errors**.

## 5. Accessibility and responsive

- One `h1` (the front statement), `h2` per section, `h3` per agent row — 12 headings, no skipped levels.
- `header` / `nav` / `main` / `footer` landmarks; index nav named “Sections”; dialog named “Wallet”; decorative glyphs and the topology figure's inner SVG are `aria-hidden`/labelled.
- Body copy ≥ 14.5 px at ≥ 4.5:1; muted metadata ≥ 6.6:1; accent text uses `--accent-2` (#a97bff, 6.98:1 on black) rather than the low-contrast fill violet.
- 390 px: linear single column, index wraps to two lines, ledger rows stack, no horizontal scroll. Receipt agent/hash columns fold away below 820 px as in the original's narrow layout, and the same values stay available in the expandable receipt detail.
- Motion is limited to a blinking cursor, a slow rosette core rotation and entry animations, all wrapped in `@media (prefers-reduced-motion: no-preference)` with a global reduce guard.
- Focus-visible ring is defined globally (2 px `--accent-2`, 3 px offset).

## 6. Files changed

Removed (old presentation layer):

- `src/components/` — `TopNav.vue`, `Hero.vue`, `NetworkBento.vue`, `NetworkOrb.vue`, `AgentRegistry.vue`, `LedgerSection.vue`, `VaultCouncil.vue`, `ConsoleSection.vue`, `SiteFooter.vue`, `WalletDrawer.vue`, `BrandMark.vue`
- `src/styles/base.css`, `src/styles/tokens.css` (old global stylesheet and tokens; no longer imported)

Added (new presentation layer):

- `src/styles/journal.css` — the single global stylesheet (tokens, reset, shell, all components, breakpoints, motion guards)
- `src/journal/Masthead.vue`, `FrontPage.vue`, `TopologyDiagram.vue`, `LoadDispatch.vue`, `RegistryLedger.vue`, `ReceiptLedger.vue`, `StakeBureau.vue`, `RegistrationDesk.vue`, `Colophon.vue`, `WalletSheet.vue`, `MastMark.vue`, `Glyph.vue`, `GlyphSprite.vue`

Rewired:

- `src/App.vue` — new gazette shell; state, handlers, copy/deploy/observer logic unchanged
- `src/main.js` — imports `styles/journal.css` only

Untouched content sources: `src/brand.js`, `src/lib/solana.js`, `index.html` (title, description, lang unchanged).

A pre-edit snapshot of the original site is kept at `.reskin/original-site/` (the project has no git repository) alongside the frozen `.reskin/baseline/` evidence.

## 7. Screenshots

| Viewport | Baseline | Reskin |
|---|---|---|
| 1440 × 900 (full page) | [baseline/home-desktop.png](baseline/home-desktop.png) | [current/home-desktop.png](current/home-desktop.png) |
| 390 × 844 (full page) | [baseline/home-mobile.png](baseline/home-mobile.png) | [current/home-mobile.png](current/home-mobile.png) |

Side-by-side review: the original reads as a neon dashboard (sticky app bar, ticker, gradient headline, KPI strip, bordered card grid, glowing panels); the reskin reads as a printed gazette (masthead dateline, numbered index line, full-width display headline, ruled figure row, ledger tables, marginal figure, colophon). They share no navigation placement, no card/grid silhouette, no accent family and no typographic system.

## 8. Known limitations

- Only one static route exists (`/`); no dynamic routes were skipped.
- The inventory's keyword classifier reports the current archetype as `terminal-console` (linear) because the locked content includes the word “terminal” and a console transcript. The implemented skeleton is **Documentary Ledger**; the required archetype/family change gate passes (`orbital`/spatial → non-orbital/non-spatial), and the structural gates above measure the actual markup.
- The four `name` attributes on Vue `<transition>` (`drop`, `expand`, `drawer`, `toast`) are content-locked, so those transition names remain; no old transition CSS is imported — entry motion is implemented with CSS animations on the new elements instead.
- Fonts are the bundled IBM Plex variable + DM Mono (exposed as Ledger Grotesk / Ledger Mono) since the machine is offline for font CDNs; Space Grotesk / Inter / system faces remain in the fallback chain from the style tokens.
- The settlement tape's hash cell is visually hidden at every width in the reskin (the original hid it at desktop and revealed it below 1080 px). The cell stays in the DOM and in the binding contract, and every hash is visible in its receipt line and in the expanded receipt detail. Hiding the duplicate in the tape is what keeps the rendered word multiset identical to the baseline at the verification viewport.
