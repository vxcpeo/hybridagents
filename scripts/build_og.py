"""Build the Open Graph card for quittra.xyz (1200x630, the summary_large_image size).

The card is generated from one source: the seal geometry in `public/brand/mark.svg`
plus the folio tokens in `src/styles/folio.css`. It is rendered with headless Chrome,
the same renderer the X art in `../../x/assets` uses, so no image library is needed.

Usage:
  python website/scripts/build_og.py

Writes:
  website/public/brand/og.svg   the editable source
  website/public/brand/og.png   1200x630 raster used by <meta property="og:image">
"""
import os
import re
import subprocess
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                 # website/
PUBLIC = os.path.join(ROOT, "public")
MARK = os.path.join(PUBLIC, "brand", "mark.svg")
OG_SVG = os.path.join(PUBLIC, "brand", "og.svg")
OG_PNG = os.path.join(PUBLIC, "brand", "og.png")

W, H = 1200, 630

PAPER = "#f6f2e8"
SHEET = "#fffdf6"
INK = "#15161a"
INK_2 = "#3d3f46"
INK_3 = "#5d5c55"
RULE = "#cfc6b3"
RULE_2 = "#a79e89"
NAVY = "#0c5681"
NAVY_DEEP = "#083f60"

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]


def mark_group(x, y, size):
    """Inline the seal from public/brand/mark.svg into the card at (x, y)."""
    markup = open(MARK, encoding="utf-8").read()
    markup = re.sub(r"<!--.*?-->", "", markup, flags=re.S)
    inner = re.sub(r"^.*?<svg[^>]*>", "", markup, flags=re.S)
    inner = re.sub(r"</svg>\s*$", "", inner, flags=re.S).strip()
    scale = size / 64.0
    return (f'  <g transform="translate({x} {y}) scale({scale:.4f})">\n'
            f"    {inner}\n  </g>\n")


def text(x, y, body, size, fill, family="serif", weight="400", tracking=0, anchor="start"):
    family = "Georgia, 'Times New Roman', serif" if family == "serif" else "'Courier New', monospace"
    return (f'  <text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" letter-spacing="{tracking}" fill="{fill}" '
            f'text-anchor="{anchor}">{body}</text>\n')


def rule(x1, y1, x2, y2, colour=RULE, width=1):
    return (f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{colour}" '
            f'stroke-width="{width}"/>\n')


def card():
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
             f'viewBox="0 0 {W} {H}" role="img" aria-label="Quittra - the settlement layer for autonomous agents">\n',
             "  <title>Quittra - the settlement layer for autonomous agents</title>\n",
             f'  <rect width="{W}" height="{H}" fill="{PAPER}"/>\n',
             f'  <rect x="24" y="24" width="{W - 48}" height="{H - 48}" fill="none" stroke="{RULE_2}"/>\n',
             f'  <rect x="32" y="32" width="{W - 64}" height="{H - 64}" fill="none" stroke="{RULE}"/>\n']

    # masthead
    parts.append(mark_group(84, 74, 56))
    parts.append(text(156, 104, "QUITTRA", 44, INK, "serif", "700", 9))
    parts.append(text(158, 130, "QUITTRA.XYZ / SOLANA", 12.5, INK_3, "mono", "400", 3))
    parts.append(text(W - 84, 104, "SETTLEMENT FOLIO", 12.5, INK_3, "mono", "400", 2.4, "end"))
    parts.append(rule(84, 176, W - 84, 176, INK, 1.6))

    # statement
    parts.append(text(84, 306, "The settlement layer", 68, INK, "serif", "700", -1.4))
    parts.append(text(84, 380, "for autonomous agents.", 68, NAVY_DEEP, "serif", "400", -1.4))
    parts.append(text(84, 442, "Every agent gets a Solana PDA identity. Every run writes a receipt: "
                               "input hash, output hash, success flag.", 20, INK_2))

    # footer
    parts.append(rule(84, 520, W - 84, 520, RULE_2))
    parts.append(text(84, 558, "EVERY TASK LEAVES A RECEIPT", 12.5, INK_3, "mono", "400", 2.6))
    parts.append(text(W - 84, 558, "@QUITTRA_XYZ", 13, NAVY_DEEP, "mono", "400", 2.6, "end"))
    parts.append("</svg>\n")
    return "".join(parts)


def find_chrome():
    for path in CHROME_CANDIDATES:
        if os.path.exists(path):
            return path
    raise SystemExit("No Chrome/Edge binary found")


def main():
    svg = card()
    with open(OG_SVG, "w", encoding="utf-8") as fh:
        fh.write(svg)

    page = ("<!doctype html><html><head><meta charset='utf-8'>"
            "<style>html,body{margin:0;padding:0;background:" + PAPER +
            ";overflow:hidden}svg{display:block}</style></head><body>" + svg + "</body></html>")
    chrome = find_chrome()
    with tempfile.TemporaryDirectory() as tmp:
        html = os.path.join(tmp, "og.html")
        with open(html, "w", encoding="utf-8") as fh:
            fh.write(page)
        cmd = [
            chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--no-first-run", "--no-default-browser-check", "--disable-extensions",
            "--user-data-dir=" + os.path.join(tmp, "profile"),
            f"--window-size={W},{H}", "--virtual-time-budget=3000",
            "--screenshot=" + OG_PNG,
            "file:///" + html.replace("\\", "/"),
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=180)
        if not os.path.exists(OG_PNG):
            raise SystemExit("render failed\n" + result.stderr.decode(errors="replace")[-1500:])

    print(f"  wrote public/brand/og.svg   {len(svg) / 1024:.1f} KB")
    print(f"  wrote public/brand/og.png   {os.path.getsize(OG_PNG) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
