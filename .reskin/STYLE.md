# Reskin art direction — Agora Violet

> Selected automatically. Do not ask the user to confirm or choose another direction.

- **Style DNA:** `polygon-agora` (technical-editorial)
- **Skeleton:** `documentary` (editorial)
- **Seed:** `380c4457924739cb7c54778023465c05cb8e33c3522cfa6e1c4aed9e63c1f599`
- **Source DNA:** [https://polygon.technology](https://polygon.technology)
- **Live sampled:** yes — https://polygon.technology (3141 ms)
- **Original:** orbital / light / accent #22f5c8

## Why this direction

The selector sampled 9/10 blockchain references, scored every direction for perceptual distance from the original accent (#22f5c8) and background (#e6f0ff), added a deterministic seed jitter, and chose Agora Violet because it is 158 ΔE away from the original accent and pairs with Documentary Ledger, a editorial skeleton rather than the original orbital.

## Live reference sampling

| Style | URL | Result | Accent sampled | Ground sampled |
|---|---|---|---|---|
| polygon-agora | https://polygon.technology | ok (3141 ms) | #670de5 | #000000 |
| solana-spectrum | https://solana.com | ok (3924 ms) | #9945ff | #000000 |
| base-cobalt | https://www.base.org | ok (4906 ms) | #0000ff | #dde3e9 |
| ethereum-paper | https://ethereum.org | ok (5228 ms) | #0c5681 | #ffffff |
| uniswap-bubblegum | https://uniswap.org | ok (3874 ms) | — | #ffffff |
| aave-abyss | https://aave.com | ok (3716 ms) | #ff0000 | #000000 |
| arbitrum-signal | https://arbitrum.io | failed: HTTP 403 | — | — |
| cosmos-orbit | https://cosmos.network | ok (5884 ms) | #40b3ff | #000000 |
| sui-tidal | https://sui.io | ok (6480 ms) | #298dff | #ffffff |
| optimism-poster | https://www.optimism.io | ok (12839 ms) | #ff0421 | #fafaf9 |

Live sampling is evidence, not a copy target. Never download or reuse a reference site's logo, imagery, copy, or code. Use only the abstract tokens below.

## Candidate ranking

| Candidate | Score | Accent ΔE from original | Layout | Live |
|---|---:|---:|---|---|
| Agora Violet | 0.9993 | 157.9 | documentary | yes |
| Spectrum Terminal | 0.9641 | 157.9 | ticker-stage | yes |
| Signal Navy | 0.9533 | 68.3 | terminal-console | no |
| Cosmos Orbit | 0.9317 | 76.4 | documentary | yes |
| Cobalt Blueprint | 0.8803 | 187.6 | command-rail | yes |
| Paper Protocol | 0.8589 | 83.8 | documentary | yes |
| Abyss Liquidity | 0.8215 | 153.5 | terminal-console | yes |
| Poster Optimism | 0.7223 | 146.2 | ticker-stage | yes |
| Tidal Sui | 0.6416 | 111.7 | gallery-scroll | yes |
| Bubblegum Exchange | 0.5167 | 134.1 | split-stage | yes |

## Skeleton brief

**Documentary Ledger** — masthead instead of app bar; serif or high-contrast display voice with running-text rhythm; numbered sections and marginalia; tables styled as ledger rules, not cards; navigation is an index line under the masthead.

Navigation: Masthead with the brand as a wordmark, route names as an index line, and a thin rule. No pills, no filled app bar, no sidebar.

Structure:
1. masthead with issue/date line
1. index line of routes
1. hero statement spanning 9 columns
1. two-column body: 7-column ledger + 3-column marginalia
1. footnotes and colophon

Content mapping: Turn dashboard metrics into a lede paragraph with displayed figures. Tables become ledger rows with rules and tabular numerals. Forms become a typeset questionnaire. Keep every label and value; restyle hierarchy only.

Recipe: `.masthead{display:grid;grid-template-columns:1fr auto;align-items:end;border-bottom:2px solid var(--ink);padding-bottom:12px}.index{display:flex;gap:28px;border-bottom:1px solid var(--line);padding:12px 0;font:500 12px/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase}.body{display:grid;grid-template-columns:minmax(0,7fr) minmax(220px,3fr);gap:clamp(24px,5vw,72px)}.lede{font-size:clamp(2rem,4vw,4.6rem);line-height:.98}`

Risks: serif font alone is not a skeleton change; dense dashboards need tabular numerals and generous line-height

## Design tokens

```css
:root {
  --bg: #000000;
  --surface: #141415;
  --surface-alt: #1F1E20;
  --ink: #F2F3F7;
  --muted: #A0A1A6;
  --accent: #670de5;
  --accent-safe: #9f45ff;
  --accent-2: #A97BFF;
  --line: #2B2930;
  --success: #5CE1A0;
  --danger: #FF8A8A;
  --warning: #F2C94C;

  --font-display: "Space Grotesk", "Century Gothic", "Segoe UI", sans-serif;
  --font-body: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-mono: "PolySans Mono", "Cascadia Mono", ui-monospace, monospace;
  --display-weight: 520;
  --display-tracking: -0.045em;
  --label-tracking: 0.14em;

  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --border: 1px solid var(--line);
  --shadow: 0 0 0 1px rgba(169, 123, 255, 0.08), 0 30px 90px rgba(0, 0, 0, 0.55);

  --motion-duration: 260ms;
  --motion-ease: cubic-bezier(.16,1,.3,1);
  --space-1: clamp(4px, .35vw, 6px);
  --space-2: clamp(8px, .7vw, 12px);
  --space-3: clamp(14px, 1.2vw, 20px);
  --space-4: clamp(22px, 2vw, 32px);
  --space-5: clamp(36px, 3.4vw, 56px);
  --space-6: clamp(56px, 5vw, 88px);
  --page-pad: clamp(18px, 4vw, 64px);
  --max-width: 1440px;
}
```

## Component grammar

- Surface: 1px solid var(--line); radius 6px; shadow 0 0 0 1px rgba(169, 123, 255, 0.08), 0 30px 90px rgba(0, 0, 0, 0.55).
- Type: display **"Space Grotesk", "Century Gothic", "Segoe UI", sans-serif** at weight 520, tracking -0.045em; body **"Inter", "Segoe UI", system-ui, sans-serif**; numerals and micro-labels **"PolySans Mono", "Cascadia Mono", ui-monospace, monospace**.
- Texture: violet bloom, index numerals, hairline rules, mono metadata gutters.
- Motion: measured, 260ms, cubic-bezier(.16,1,.3,1). Always wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)`.
- Density: compact. Keep body text >= 14px and body contrast >= 4.5:1.
- Use `--accent-safe` for text and icons on `--bg`; use `--accent` for fills and large shapes.

## Originality guard

The replacement must satisfy all of these:

1. The source inventory archetype is `orbital`; the new skeleton is `documentary`. Do not fall back to the old shell during implementation.
2. Do not reuse any original class name, CSS selector, design token name, or original accent family.
3. Rewrite templates, not only CSS. Every route must visibly use the new skeleton.
4. Keep every token in `.reskin/content-contract.json`; move it, never rewrite it.
5. Run `node scripts/verify.mjs check` and do not stop until content, structure, accessibility and responsive checks pass.

## Commit statement

Use this sentence in the final report: "The UI was rebuilt around Agora Violet / Documentary Ledger; the original orbital shell and palette were removed while the content contract stayed byte-for-byte intact."
