# Reskin inventory — stakri-workspace

Generated: 2026-10-20T16:00:06.162Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/hybridagents/website` |
| Vue | ^3.5.13 |
| Package manager | npm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 17 (12 SFCs) |

## Original skeleton

- Archetype: **orbital** (spatial)
- Traits: sidebar, cards, hero, grid, modal, charts, sticky, orbital, terminal, bento, ticker
- Max template depth: 9
- Top-level tags: div, topnav, main, sitefooter, walletdrawer, transition, section, svg, section, section, section, section, div, footer, header, section, transition

The replacement skeleton must not be `orbital` and must not be in the same family (`spatial`).

## Routes

- `/`

## Palette (most used first)

`#22f5c8` (17) · `#04070f` (7) · `#00d0ff` (6) · `#7c5cff` (5) · `#000000` (4) · `#04121a` (3) · `#070c18` (3) · `#ff5d7a` (3) · `#0e1729` (2) · `#b6ffe6` (2)

## Content lock

- Static visible text tokens: **115**
- Binding expressions: **123**
- Event handlers: **39**
- Contract hash: `0797fe0639f3899e09e9dfb2782922137bd9989055429394b20934646815f7ea`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/hybridagents/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/hybridagents/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
