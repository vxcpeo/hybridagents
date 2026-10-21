# Reskin inventory — quittra-workspace

Generated: 2026-10-21T16:51:16.685Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/hybridagents/website` |
| Vue | ^3.5.13 |
| Package manager | npm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 18 (14 SFCs) |

## Original skeleton

- Archetype: **terminal-console** (linear)
- Traits: cards, table, grid, tabs, modal, charts, sticky, terminal, ticker
- Max template depth: 9
- Top-level tags: div, footer, section, svg, svg, section, svg, header, nav, transition, section, section, section, section, figure, transition

The replacement skeleton must not be `terminal-console` and must not be in the same family (`linear`).

## Routes

- `/`

## Palette (most used first)

`#000000` (2) · `#08080a` (2) · `#0a0a0c` (2) · `#5ce1a0` (2) · `#670de5` (2) · `#a97bff` (2) · `#c6a6ff` (2) · `#ff8a8a` (2) · `#04020a` (1) · `#141415` (1)

## Content lock

- Static visible text tokens: **115**
- Binding expressions: **127**
- Event handlers: **39**
- Contract hash: `c3e0f24e23cb742313191d8cdfec27d7659f615309dec094132507e2f8b08b4d`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/hybridagents/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/hybridagents/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
