# Reskin report — Coventa Abyss / Orbital

Project: `E:/workspace/chuangye/solana/hybridagents/website` (Vue 3.5 + Vite 6, single static route `/`)
Result: **PASS** — `node scripts/verify.mjs check --project . --out .reskin --port 4418` exits 0 with 0 blocking issues and 1 explained warning.

> The UI was rebuilt around **Abyss Liquidity** / **Orbital**; the original **sidebar-workspace** shell and palette were removed while the content contract stayed byte-for-byte intact.

## 1. Selected direction

| | |
|---|---|
| Style | **Abyss Liquidity** (`aave-abyss`, dark-technical) |
| Source DNA | [https://aave.com](https://aave.com) — live sampled, 1178 ms |
| Live sampling | 8 of 10 blockchain references returned; `solana.com` gave HTTP 429 and `arbitrum.io` gave HTTP 403, both fell back to the bundled catalog |
| Skeleton | **Orbital** (`orbital`, spatial) |
| Original | `sidebar-workspace` (shell family) per the inventory classifier: sticky cover rail, numbered index, chapter column |
| New accent | `#ff2f2f` — **113.24 ΔE** from `#083f60` (threshold 30) |
| Type | Trebuchet MS for display, Segoe UI for body, Cascadia Mono for figures and on-chain strings; system faces only |
| Tokens | `--ab-ground:#04060a`, `--ab-panel:#111a24`, `--ab-line:#1e2a36`, `--ab-ink:#f4f7fa`, `--ab-mute:#9db0c2`, `--ab-accent:#ff2f2f`, `--ab-accent-text:#ff6b6b` (text-safe), `--ab-accent-2:#ff00ff` (haze only) |
| Texture | glass panels, concentric orbit rings, dashed arcs, a rotating conic sweep, fine instrument grid, crimson glow |
| Shape language | 16–24 px panels, fully circular gauges, badges and monograms, hairline rules, no drop shadows except floating surfaces |

Evidence: `.reskin/style.json`, `.reskin/STYLE.md`, candidate ranking (Abyss Liquidity 0.9692, next best Poster Optimism 0.9156).

## 2. How the skeleton changed

| Region | Original (folio) | Reskin (abyss) |
|---|---|---|
| Shell | sticky left cover rail (`aside`) + scrolling folio column | sticky top HUD (`header`) + telemetry rail + centred stage + floor (`footer`) |
| Landmarks | `aside, nav, main, div[role=contentinfo]` | `header, nav, main, footer` — landmark similarity 0.222 |
| Navigation | numbered vertical index inside the cover, active entry gets a navy spine | floating **orbit dial** pinned lower-right: five nodes on a 258 px dashed ring, active node lit; past the opening statement it retracts to an 82 px hub so the instruments underneath stay clear, and the hub opens the labelled drawer; small screens get a bottom node bar plus the same drawer |
| Hero | left headline, right engraved dial plate, 4-column ruled figure row | centred reactor: 720 px concentric halo stack + rotating sweep + graduated field behind the statement, program pill on the ring base, figures lifted onto a separate orbit rail |
| Chapter heads | vertical chapter mark in the left margin, title + note in the text column | circular chapter badge (`01 / network`) with a counter-rotating arc, title + note beside it |
| Network | measure plate + tape register side by side, indicators in a 2×2 ruled grid | chart panel + tape panel as glass instruments, four metric capsules on a rail |
| Registry | two-column index of ruled rows with monogram tiles | two-row control capsule over a 3-column constellation of record cards with circular monograms and arc meters |
| Ledger | full-width receipt sheet, three-column bulletin beneath | receipts panel beside a vertical activity rail; details expand in place |
| Vault | staking leaf beside the ballot sheet | conic utilisation gauge + tallies, stake capsule with a vault-aperture ring, ballots as a 3-up row |
| Console | transcript band above a 2-column questionnaire | terminal panel beside the registration capsule in one framed desk |
| Footer | 4-column imprint strip | centred mark and tagline, three link columns, base rail over a faint outer-ring arc |

Hard numbers from the checker: DOM fingerprint similarity **0.27** (limit 0.50), landmark similarity **0.222** (limit 0.68), rendered CSS class overlap **0.000** (limit 0.10) — no class name from the old presentation layer survives.

## 3. Verification

`.reskin/VERIFICATION.md` / `.reskin/verification.json`, generated 2026-11-09T17:18Z against `http://127.0.0.1:4418/`.

| Gate | Threshold | Result |
|---|---|---|
| Source content contract | no removals/changes | **PASS** — 0 issues, 0 warnings |
| Route renders | 200, no console/page errors | **PASS** — `/` 200, 0 console errors, 0 page errors |
| Rendered visible words | multiset parity | **PASS** — 444 words, no missing/added token |
| Rendered attributes | multiset parity | **PASS** — 1 explained aria warning (below), no placeholder/title drift |
| Form fields | multiset parity | **PASS** — 6 inputs + 1 textarea |
| DOM fingerprint | ≤ 0.50 | **PASS** — 0.27 |
| Landmark sequence | ≤ 0.68 | **PASS** — 0.222 |
| CSS class overlap | ≤ 0.10 | **PASS** — 0.000 |
| Accent distance | ≥ 30 ΔE | **PASS** — 113.24 ΔE (`#083f60` → `#ff2f2f`) |
| Contrast (1440 × 900 / 390 × 844) | 0 failures | **PASS** — 0 failures across 355 checked nodes on desktop, 0 on mobile |
| Axe WCAG 2.x | 0 serious/critical | **PASS** — 0 serious, 0 moderate |
| Horizontal overflow @390 | none | **PASS** — scrollWidth = clientWidth = 390, 0 offenders |
| Mobile navigation | reachable | **PASS** — 5 visible section anchors + drawer toggle |
| Keyboard focus | visible indicator | **PASS** — 2 px accent outline on every tab sample |
| Labels / alt text | no issues | **PASS** — 0 field, 0 interactive, 0 image issues |

Numeric tokens: identical (65 tokens / 80 total) — the live figures did not drift.

Content-contract hash: `58a527b92d70bbcde0f5926ac78d328ad41ddb4c66243598a9990d03b727b1d6` on both baseline and current.

The one warning is intentional: the old topology plate carried
`role="img" aria-label="Live agent topology around the settlement program"`. The new field is
purely decorative (`aria-hidden`), and the same information is carried by the visible legend
(`program` / `agent pda` / `registered`) and the program pill, so no accessible name was invented
for a graphic that no longer encodes a specific topology.

## 4. Behaviour verified in a real browser

`.reskin/interactions.mjs` (Playwright + installed Chrome, desktop 1440×900 and mobile 390×844) —
**21/21 checks pass**:

dial node scrolls to registry and the active node follows the page; registry search filters to one
agent; the idle lane isolates the idle agent; success sort ranks the 99.9 % agent first; the failed
filter isolates one receipt and it expands to `input_hash` / `output_hash`; the wallet docket opens,
shows program / fee payer / fee, approving connects `Phantom` and raises the toast; a council vote
flips to “voted yes” + “recorded”; the stake stepper increments 250 → 300; the registration form
writes `result / …` into the transcript; five dial anchors expose section hashes; 390 px has no
horizontal overflow; five anchors stay visible in the mobile bar; the drawer opens with five rows,
navigates to the vault and closes again; **0 runtime errors** throughout.

## 5. Accessibility and responsive

- One `h1` (the reactor statement), one `h2` per chapter, one `h3` per agent entry; no skipped levels.
- `header`, `nav` (labelled “Sections”), `main`, `footer` landmarks; the wallet docket is a named modal dialog; every control carries an accessible name; icon-only controls use `aria-label`.
- The active dial node carries `aria-current="location"`; the decorative field, dial disc, glow layers and sweep are `aria-hidden` and `pointer-events: none`.
- Body copy ≥ 14 px at ≥ 4.5:1: `--ab-mute` (#9db0c2) on the panel reads 7.9:1, `--ab-accent-text` (#ff6b6b) on the ground 7.4:1, primary buttons use near-black type on the accent fill (5.4:1).
- 390 px: HUD wraps to two rows, the telemetry rail becomes a two-line strip, the dial becomes a bottom node bar, all panels and cards stack to one column, the receipt row folds agent/hash cells, ballot cards stack.
- Motion is limited to a 34 s halo rotation, 22 s/26 s dial rotations, an entry rise and a blinking terminal cursor, all inside `prefers-reduced-motion` guards with a global reduce fallback.
- `:focus-visible` is global (2 px `--ab-accent-text`, 3 px offset); the search field, inputs and stepper show an accent border on focus.

## 6. Files changed

Removed from the render path and from disk:

- `src/folio/` — `FolioCover.vue`, `Overture.vue`, `TopologyPlate.vue`, `ThroughputChapter.vue`, `RegisterChapter.vue`, `ReceiptsChapter.vue`, `StakeChapter.vue`, `ConsoleChapter.vue`, `Imprint.vue`, `WalletSlip.vue`, `SealMark.vue`, `XMark.vue`, `Icon.vue`, `IconSprite.vue`
- `src/styles/folio.css` (old global stylesheet)

Added:

- `src/styles/abyss.css` — the single global stylesheet (tokens, reset, shell, instruments, chapters, overlays, breakpoints, motion guards, the four locked transitions `drop` / `expand` / `drawer` / `toast`)
- `src/orbit/AbyssHeader.vue`, `TelemetryRail.vue`, `OrbitDock.vue`, `OrbitCore.vue`, `CoreFigure.vue`, `OrbitRail.vue`, `NetworkOrbit.vue`, `RegistryOrbit.vue`, `LedgerOrbit.vue`, `VaultOrbit.vue`, `ConsoleOrbit.vue`, `AbyssFloor.vue`, `WalletHud.vue`, `CoventMark.vue`, `OrbGlyph.vue`, `GlyphField.vue`, `SocialXGlyph.vue`

Rewired:

- `src/App.vue` — new abyss shell; observer, ticker, wallet, toast, registration and inspection logic unchanged
- `src/main.js` — imports `styles/abyss.css` only

Brand and document presentation (no content):

- `index.html` — `theme-color` → `#04060a`, `color-scheme` → `dark` (title, description, lang, links untouched)
- `public/brand/mark.svg`, `favicon.svg` — the new orbit mark
- `public/brand/og.svg`, `og.png` (1200×630), `apple-touch-icon.png` (180×180) — regenerated by the rewritten `scripts/build_og.py`

Untouched content sources: `src/brand.js`, `src/lib/solana.js`, the copy contract (all visible text, attributes, bindings, handlers, routes, forms).

A pre-edit snapshot of the outgoing site is kept at `../.reskin-history/pre-edit-site/`, and the previous reskin run at `../.reskin-history/folio-run/` (the project has no git repository).

## 7. Screenshots

| Viewport | Baseline (folio) | Reskin (abyss) |
|---|---|---|
| 1440 × 900 (full page) | [baseline/home-desktop.png](baseline/home-desktop.png) | [current/home-desktop.png](current/home-desktop.png) |
| 390 × 844 (full page) | [baseline/home-mobile.png](baseline/home-mobile.png) | [current/home-mobile.png](current/home-mobile.png) |
| Social card | — | [../../public/brand/og.png](../../public/brand/og.png) |

Side-by-side reading: the baseline is a warm paper protocol folio — cream stock, Georgia, navy
hairlines, a sticky cover rail with a numbered index, ruled registers and a printed seal. The
reskin is an abyssal instrument panel — near-black ground with a crimson halo, Trebuchet display
against mono telemetry, glass instruments and orbit rings, a floating orbit dial for navigation and
circular chapter badges. They share no navigation placement, no card/table silhouette, no accent
family and no typographic system.

## 8. Companion deliverable — X launch kit

The X identity was rebuilt from the same tokens and the same mark, so the profile
and the site read as one system:

| Asset | File | Size |
|---|---|---|
| Profile avatar (orbit mark on an instrument dial) | [`../../x/profile-avatar-400.png`](../../x/profile-avatar-400.png) | 400×400 (+@2x) |
| Profile banner | [`../../x/banner-1500x500.png`](../../x/banner-1500x500.png) | 1500×500 (+@2x) |
| Pinned launch card | [`../../x/tweet-image-launch-1600x900.png`](../../x/tweet-image-launch-1600x900.png) | 1600×900 (+@2x) |
| Workspace / agent-PDA card | [`../../x/tweet-image-workspace-1600x900.png`](../../x/tweet-image-workspace-1600x900.png) | 1600×900 (+@2x) |
| Mechanics card | [`../../x/tweet-image-mechanics-1600x900.png`](../../x/tweet-image-mechanics-1600x900.png) | 1600×900 (+@2x) |

- Art is generated by `x/assets/build_art.py` (five SVG artboards) and rasterised through headless Chrome by `x/assets/render_png.py --embed`; `x/assets/verify_assets.py` passes (10 PNGs at exact sizes, 5 self-contained embedded SVGs, 0 remote refs, mark geometry identical to `src/orbit/CoventMark.vue`).
- The series is [`../../x/coventa-x-series.md`](../../x/coventa-x-series.md): 10 single posts across `D0`–`D6`, three visual posts (02 pinned launch card, 04 workspace, 06 mechanics) none adjacent, seven text-only; `writex` lint passes with 0 errors / 0 warnings.
- [`../../x/bio.md`](../../x/bio.md) carries the 154/160 bio plus two alternates and the publication gate for `coventa.xyz` / `@coventa_xyz`; [`../../x/tweet-copy.md`](../../x/tweet-copy.md) holds the paste-ready copy for 02, 03, 04 and 06; [`../../x/BRAND.md`](../../x/BRAND.md) and [`../../x/README.md`](../../x/README.md) were updated to the Abyss direction.

## 9. Known limitations

- Only one static route exists (`/`); no dynamic routes were skipped.
- The inventory classifier now reports `orbital` (spatial); the old classifier said `sidebar-workspace` (shell) because of the `<aside>` cover rail. Both the id and the family changed.
- The fixed orbit dock floats above the page corner. It is fully expanded only over the opening statement; after 340 px of scroll it retracts to an 82 px hub whose button opens the labelled drawer, so it never sits on top of a panel while you read. Its disc, rings and glow are `pointer-events: none`, so only the five node links, the hub/toggle and the drawer receive clicks; the mobile bar sits above scroll content the same way a tab bar would.
- The self-hosted `public/fonts/` TTFs (DM Mono, IBM Plex Sans) are no longer referenced — the abyss direction uses system faces. They are left on disk, unimported, rather than deleted mid-run.
- The four Vue `<transition>` names (`drop`, `expand`, `drawer`, `toast`) are content-locked, so they remain; the transition CSS itself is new (`abyss.css`).
- The settlement tape's hash cell stays visually hidden at every width, exactly as in the baseline, so the rendered word multiset matches; every hash remains visible in its receipt row and in the expanded receipt detail.
- `aria-current="location"` was added to the active dial node. The attribute audit only tracks `aria-label` / `placeholder` / `alt` / `title`, so this addition is not part of the frozen attribute multiset; it improves navigation semantics without adding visible copy.
