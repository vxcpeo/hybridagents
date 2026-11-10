# Reskin inventory — coventa-workspace

Generated: 2026-11-09T16:47:35.598Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/hybridagents/website` |
| Vue | ^3.5.13 |
| Package manager | npm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 19 (15 SFCs) |

## Original skeleton

- Archetype: **sidebar-workspace** (shell)
- Traits: sidebar, grid, modal, charts, sticky, terminal, ticker
- Max template depth: 9
- Top-level tags: div, section, aside, svg, svg, div, section, section, section, svg, section, section, figure, transition, svg

The replacement skeleton must not be `sidebar-workspace` and must not be in the same family (`shell`).

## Routes

- `/`

## Palette (most used first)

`#e8e4d8` (6) · `#fffdf6` (5) · `#15161a` (4) · `#ece5d4` (4) · `#0c5681` (2) · `#8fd9b0` (2) · `#083f60` (1) · `#12141a` (1) · `#2a6249` (1) · `#3d3f46` (1)

## Content lock

- Static visible text tokens: **114**
- Binding expressions: **135**
- Event handlers: **38**
- Contract hash: `58a527b92d70bbcde0f5926ac78d328ad41ddb4c66243598a9990d03b727b1d6`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/hybridagents/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/hybridagents/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
