# Reskin verification — PASS

Generated: 2026-10-20T16:24:49.507Z

- Project: **stakri-workspace**
- URL: http://127.0.0.1:4899/
- Original skeleton: `orbital` (spatial)
- New skeleton: `terminal-console` (linear)
- Accent: #22f5c8 -> #670de5 (170.69 ΔE; min 30)
- Source contract: intact (`ca9c02539859`)

| Route | Result | DOM similarity | Landmark similarity | Axe serious | Screenshot |
|---|---|---:|---:|---:|---|
| `/` | PASS | 0.4 | 0.286 | 0 | [desktop](current/home-desktop.png) |

## Blocking issues

- None.

## Warnings

- bindings: added "attr:`#${item.id}`"
- bindings: added "attr:symbol"
- bindings: added "link:`#${item.id}`"
- bindings: added "link:symbol"
- /: numeric token count changed: 74 -> 80 (dynamic values may differ)
- /: link target added: #console
- /: link target added: #ledger
- /: link target added: #network
- /: link target added: #registry
- /: link target added: #vault

## Thresholds

- DOM fingerprint similarity <= 0.5
- Landmark sequence similarity <= 0.68
- CSS class overlap <= 0.1
- Accent distance >= 30 ΔE
- Contrast failures <= 0
- Axe serious/critical <= 0

All content is compared as a multiset of visible words plus rendered attribute values. Reordering is allowed, rewriting/removing/adding visible copy is not. Dynamic numeric values are reported as warnings, never silently accepted.
