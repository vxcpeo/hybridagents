"""Build the brand raster set for coventa.xyz.

One source geometry (the abyss orbit mark) and one token set (the dark-technical
palette) drive both the Open Graph card (1200x630, summary_large_image) and the
Apple touch icon (180x180). Rendering uses headless Chrome, the same renderer the
X art in `../../x/assets` uses, so no image library is needed.

Usage:
  python website/scripts/build_og.py

Writes:
  website/public/brand/og.svg                  the editable source
  website/public/brand/og.png                  1200x630 raster for <meta og:image>
  website/public/brand/apple-touch-icon.png     180x180 raster (rendered from mark.svg)
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
TOUCH_PNG = os.path.join(PUBLIC, "brand", "apple-touch-icon.png")

W, H = 1200, 630
TOUCH = 180

GROUND = "#04060a"
DECK = "#0a0f16"
PANEL = "#111a24"
LINE = "#1e2a36"
LINE_2 = "#2b3c4b"
INK = "#f4f7fa"
INK_SOFT = "#c6d4e1"
MUTE = "#9db0c2"
ACCENT = "#ff2f2f"
ACCENT_TEXT = "#ff6b6b"

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

MARK_64 = (
    '<path d="M51 32 A19 19 0 1 1 35.3 13.29" fill="none" stroke="{stroke}" '
    'stroke-width="5.4" stroke-linecap="round"/>'
    '<circle cx="32" cy="32" r="4.6" fill="{core}"/>'
    '<circle cx="46.55" cy="19.79" r="4.2" fill="{sat}"/>'
)


def mark_group(x, y, size, ring=ACCENT, core=INK, sat=ACCENT):
    """Inline the orbit mark at (x, y) scaled to `size` px."""
    inner = MARK_64.format(stroke=ring, core=core, sat=sat)
    scale = size / 64.0
    return f'  <g transform="translate({x} {y}) scale({scale:.4f})">{inner}</g>\n'


def text(x, y, body, size, fill, family="display", weight="400", tracking=0, anchor="start", opacity=1):
    faces = {
        "display": "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif",
        "body": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        "mono": "'Cascadia Mono', Consolas, 'Courier New', monospace",
    }
    return (f'  <text x="{x}" y="{y}" font-family="{faces[family]}" font-size="{size}" '
            f'font-weight="{weight}" letter-spacing="{tracking}" fill="{fill}" fill-opacity="{opacity}" '
            f'text-anchor="{anchor}">{body}</text>\n')


def rule(x1, y1, x2, y2, colour=LINE, width=1, dash=None):
    extra = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{colour}" '
            f'stroke-width="{width}"{extra}/>\n')


def defs():
    return (
        "  <defs>\n"
        f'    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">'
        f'<stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.34"/>'
        f'<stop offset="55%" stop-color="{ACCENT}" stop-opacity="0.10"/>'
        f'<stop offset="100%" stop-color="{ACCENT}" stop-opacity="0"/></radialGradient>\n'
        f'    <radialGradient id="haze" cx="0.5" cy="0.5" r="0.5">'
        f'<stop offset="0%" stop-color="#ff00ff" stop-opacity="0.18"/>'
        f'<stop offset="100%" stop-color="#ff00ff" stop-opacity="0"/></radialGradient>\n'
        '    <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">'
        f'<path d="M46 0H0V46" fill="none" stroke="{LINE_2}" stroke-width="1" opacity="0.5"/></pattern>\n'
        f'    <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0%" stop-color="{ACCENT}"/><stop offset="100%" stop-color="#ff00ff"/></linearGradient>\n'
        "  </defs>\n"
    )


def card():
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
             f'viewBox="0 0 {W} {H}" role="img" aria-label="Coventa - the settlement layer for autonomous agents">\n',
             "  <title>Coventa - the settlement layer for autonomous agents</title>\n",
             defs(),
             f'  <rect width="{W}" height="{H}" fill="{GROUND}"/>\n',
             f'  <rect width="{W}" height="{H}" fill="url(#grid)" opacity="0.55"/>\n',
             '  <ellipse cx="1010" cy="40" rx="430" ry="330" fill="url(#glow)"/>\n',
             '  <ellipse cx="120" cy="560" rx="380" ry="300" fill="url(#haze)"/>\n']

    # orbit instrument behind the statement
    cx, cy = 980, 300
    parts.append(f'  <g fill="none" stroke="{LINE}" stroke-width="1.2">\n')
    for r in (150, 214, 276):
        parts.append(f'    <circle cx="{cx}" cy="{cy}" r="{r}"/>\n')
    parts.append(f'    <circle cx="{cx}" cy="{cy}" r="214" stroke-dasharray="2 10"/>\n')
    parts.append("  </g>\n")
    parts.append(f'  <path d="M {cx - 276} {cy} A 276 276 0 0 1 {cx} {cy - 276}" fill="none" '
                 f'stroke="url(#arc)" stroke-width="2.4" stroke-linecap="round" opacity="0.9"/>\n')
    parts.append(f'  <g stroke="{LINE_2}" stroke-width="1" opacity="0.9">\n')
    for i in range(36):
        angle = i * 10
        parts.append(f'    <line x1="{cx}" y1="{cy - 288}" x2="{cx}" y2="{cy - 276}" '
                     f'transform="rotate({angle} {cx} {cy})"/>\n')
    parts.append("  </g>\n")
    parts.append(mark_group(cx - 36, cy - 36, 72, ring=ACCENT, core=INK, sat=ACCENT))
    parts.append(f'  <circle cx="{cx + 185}" cy="{cy + 107}" r="5.5" fill="{ACCENT}"/>\n')
    parts.append(f'  <circle cx="{cx - 150}" cy="{cy + 214}" r="4" fill="{MUTE}" opacity="0.8"/>\n')

    # masthead
    parts.append(mark_group(84, 68, 44))
    parts.append(text(144, 94, "COVENTA", 28, INK, "display", "700", 6.5))
    parts.append(text(146, 116, "COVENTA.XYZ / SOLANA", 10.5, MUTE, "mono", "400", 2.6))

    # statement
    parts.append(rule(84, 168, 700, 168, LINE))
    parts.append(text(84, 286, "The settlement layer", 62, INK, "display", "700", -2.2))
    parts.append(text(84, 356, "for autonomous agents.", 62, ACCENT_TEXT, "display", "700", -2.2))
    parts.append(text(86, 412, "Every agent gets a Solana PDA identity.", 20, INK_SOFT, "body"))
    parts.append(text(86, 442, "Every run writes a receipt: input hash, output hash, success flag.", 20, INK_SOFT, "body"))

    # mono chips
    parts.append(f'  <rect x="84" y="474" width="212" height="30" rx="15" fill="none" stroke="{LINE_2}"/>\n')
    parts.append(text(190, 494, "STAKE-BACKED", 10.5, MUTE, "mono", "400", 2.2, "middle"))
    parts.append(f'  <rect x="312" y="474" width="222" height="30" rx="15" fill="none" stroke="{LINE_2}"/>\n')
    parts.append(text(423, 494, "NO CUSTODY", 10.5, MUTE, "mono", "400", 2.2, "middle"))
    parts.append(f'  <rect x="550" y="474" width="254" height="30" rx="15" fill="none" stroke="{LINE_2}"/>\n')
    parts.append(text(677, 494, "OPEN LEDGER", 10.5, MUTE, "mono", "400", 2.2, "middle"))

    # footer
    parts.append(rule(84, 540, W - 84, 540, LINE))
    parts.append(text(84, 578, "EVERY TASK LEAVES A RECEIPT", 11, MUTE, "mono", "400", 2.6))
    parts.append(text(W - 84, 578, "@COVENTA_XYZ", 11.5, ACCENT_TEXT, "mono", "400", 2.6, "end"))
    parts.append("</svg>\n")
    return "".join(parts)


def find_chrome():
    for path in CHROME_CANDIDATES:
        if os.path.exists(path):
            return path
    raise SystemExit("No Chrome/Edge binary found")


def render(chrome, markup, width, height, dest, background):
    page = ("<!doctype html><html><head><meta charset='utf-8'>"
            "<style>html,body{margin:0;padding:0;background:" + background +
            ";overflow:hidden}svg{display:block}</style></head><body>" + markup + "</body></html>")
    with tempfile.TemporaryDirectory() as tmp:
        html = os.path.join(tmp, "card.html")
        with open(html, "w", encoding="utf-8") as fh:
            fh.write(page)
        cmd = [
            chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--no-first-run", "--no-default-browser-check", "--disable-extensions",
            "--user-data-dir=" + os.path.join(tmp, "profile"),
            f"--window-size={width},{height}", "--virtual-time-budget=3000",
            "--screenshot=" + dest,
            "file:///" + html.replace("\\", "/"),
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=180)
        if not os.path.exists(dest):
            raise SystemExit("render failed\n" + result.stderr.decode(errors="replace")[-1500:])


def touch_icon():
    markup = open(MARK, encoding="utf-8").read()
    markup = re.sub(r"<!--.*?-->", "", markup, flags=re.S)
    markup = re.sub(r"<svg[^>]*>", f'<svg xmlns="http://www.w3.org/2000/svg" width="{TOUCH}" '
                                   f'height="{TOUCH}" viewBox="0 0 64 64">', markup, count=1)
    return markup


def main():
    svg = card()
    with open(OG_SVG, "w", encoding="utf-8") as fh:
        fh.write(svg)

    chrome = find_chrome()
    render(chrome, svg, W, H, OG_PNG, GROUND)
    render(chrome, touch_icon(), TOUCH, TOUCH, TOUCH_PNG, GROUND)

    print(f"  wrote public/brand/og.svg                  {len(svg) / 1024:.1f} KB")
    print(f"  wrote public/brand/og.png                  {os.path.getsize(OG_PNG) / 1024:.0f} KB")
    print(f"  wrote public/brand/apple-touch-icon.png     {os.path.getsize(TOUCH_PNG) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
