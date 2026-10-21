/**
 * Interaction regression for the reskinned folio.
 * Serves website/dist, drives real Chrome over CDP and asserts the behaviour the
 * original gazette UI exposed (filters, wallet flow, ballots, stepper, form).
 *
 *   node .reskin/interactions.mjs
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, openPage, sleep } from '../../.rebrand/tools/rebrand-scripts/lib/chrome.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '..', 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    let file = path.join(DIST, rel);
    if (!file.startsWith(DIST)) throw new Error('escape');
    try {
      await fs.access(file);
    } catch {
      file = path.join(DIST, 'index.html');
    }
    const body = await fs.readFile(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const base = `http://127.0.0.1:${port}/`;

const checks = [];
function record(name, ok, detail = '') {
  checks.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  - ${detail}` : ''}`);
}

const browser = await launchChrome({ headless: true, width: 1440, height: 900 });
const page = await openPage(browser.cdp, { width: 1440, height: 900 });

const setValue = (selector, value) => `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) return false;
  const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
})()`;

const clickText = (selector, text) => `(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((n) => n.textContent.trim().toLowerCase() === ${JSON.stringify(text.toLowerCase())});
  if (!el) return false;
  el.click();
  return true;
})()`;

try {
  await page.navigate(base, { width: 1440, height: 900, delayMs: 900 });

  const boot = await page.evaluate(`(() => ({
    title: document.title,
    h1: document.querySelector('h1') ? document.querySelector('h1').innerText.replace(/\\s+/g, ' ').trim() : '',
    index: [...document.querySelectorAll('.foil-indexlink')].map((a) => a.textContent.trim()),
    chapters: [...document.querySelectorAll('main section')].map((s) => s.id),
    words: document.body.innerText.split(/\\s+/).filter(Boolean).length
  }))()`);
  record('boot: h1 present', boot.h1 === 'Autonomous agents that settle every task on-chain.', boot.h1);
  record('boot: five index links', boot.index.length === 5, boot.index.join(','));
  record('boot: five chapters', boot.chapters.join(',') === 'top,network,registry,ledger,vault,console', boot.chapters.join(','));
  record('boot: main landmark exists', await page.evaluate(`!!document.querySelector('main')`));
  record('boot: content rendered', boot.words > 350, `${boot.words} words`);

  await page.evaluate(clickText('.foil-indexlink', 'ledger'));
  await sleep(700);
  const hash = await page.evaluate(`location.hash`);
  record('index link: hash navigation', hash === '#ledger', hash);
  await page.evaluate(`window.scrollTo(0, 0)`);
  await sleep(400);

  await page.evaluate(setValue('.foil-searchinput', 'kestrel'));
  await sleep(350);
  record('registry: search filters to one agent', (await page.evaluate(`document.querySelectorAll('.foil-entry').length`)) === 1);
  await page.evaluate(setValue('.foil-searchinput', ''));
  await sleep(250);

  await page.evaluate(clickText('.foil-lanebtn', 'idle'));
  await sleep(300);
  record('registry: lane filter isolates idle agent',
    (await page.evaluate(`document.querySelectorAll('.foil-entry').length`)) === 1
    && (await page.evaluate(`document.querySelector('.foil-entryname').textContent.trim()`)) === 'Nimbus Kiln');

  await page.evaluate(clickText('.foil-lanebtn', 'all'));
  await page.evaluate(clickText('.foil-sortbtn', 'success'));
  await sleep(300);
  record('registry: success sort ranks the 99.9 agent first',
    (await page.evaluate(`document.querySelector('.foil-entryname').textContent.trim()`)) === 'Orrin Vale');

  await page.evaluate(clickText('.foil-filterbtn', 'failed'));
  await sleep(300);
  record('ledger: failed filter isolates one receipt', (await page.evaluate(`document.querySelectorAll('.foil-receipt').length`)) === 1);
  await page.evaluate(`document.querySelector('.foil-receiptline').click()`);
  await sleep(350);
  const detail = await page.evaluate(`(() => {
    const d = document.querySelector('.foil-receiptdetail');
    return d ? d.innerText.replace(/\\s+/g, ' ') : '';
  })()`);
  record('ledger: row expands receipt detail', /input_hash/.test(detail) && /output_hash/.test(detail), detail.slice(0, 80));
  await page.evaluate(clickText('.foil-filterbtn', 'all'));

  await page.evaluate(`document.querySelector('.foil-connect').click()`);
  await sleep(400);
  record('wallet: sheet opens', await page.evaluate(`!!document.querySelector('.foil-sheet')`));
  await page.evaluate(`document.querySelector('.foil-walletopt').click()`);
  await sleep(350);
  const signText = await page.evaluate(`document.querySelector('.foil-sheet').innerText.replace(/\\s+/g, ' ')`);
  record('wallet: signature step shows fee rows', /Approve signature/.test(signText) && /fee payer/.test(signText), signText.slice(0, 90));
  await page.evaluate(clickText('.foil-sheet button', 'approve'));
  await page.waitForExpression('!document.querySelector(".foil-sheet")', { timeoutMs: 3000 }).catch(() => null);
  await sleep(250);
  record('wallet: approve connects and closes', !(await page.evaluate(`!!document.querySelector('.foil-sheet')`))
    && (await page.evaluate(`document.querySelector('.foil-connect').innerText.trim().toLowerCase()`)) === 'phantom');
  record('wallet: toast confirms connection', await page.evaluate(`!!document.querySelector('.folio-toast')`));

  await page.evaluate(`document.querySelector('.foil-votebtn').click()`);
  await sleep(300);
  const ballot = await page.evaluate(`document.querySelector('.foil-ballot').innerText.replace(/\\s+/g, ' ')`);
  record('council: vote records locally', /voted yes/i.test(ballot) && /recorded/i.test(ballot), ballot.slice(0, 80));

  const before = await page.evaluate(`document.querySelector('.foil-stepperinput').value`);
  await page.evaluate(`document.querySelector('[aria-label="Increase"]').click()`);
  await sleep(250);
  const after = await page.evaluate(`document.querySelector('.foil-stepperinput').value`);
  record('vault: stepper increments', before === '250' && after === '300', `${before} -> ${after}`);

  await page.evaluate(setValue('.foil-form input', 'Kestrel Drift'));
  await page.evaluate(`document.querySelector('.foil-form').requestSubmit()`);
  await sleep(900);
  const transcript = await page.evaluate(`document.querySelector('.foil-transcriptbody').innerText`);
  record('console: submit writes a transcript result', /\[warn\]|\[ok\]/.test(transcript), transcript.split('\n').slice(-2).join(' | '));

  const errors = page.consoleErrors.filter((e) => !/favicon/i.test(e));
  record('console: no runtime errors', errors.length === 0, errors.slice(0, 2).join(' | '));

  await page.navigate(base, { width: 390, height: 844, mobile: true, delayMs: 900 });
  await page.evaluate(`document.querySelector('.foil-menu').click()`);
  await sleep(400);
  const drawer = await page.evaluate(`(() => ({
    open: !!document.querySelector('.foil-drawer'),
    rows: document.querySelectorAll('.foil-drawerrow').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  record('mobile: drawer opens with five rows', drawer.open && drawer.rows === 5, JSON.stringify(drawer));
  record('mobile: no horizontal overflow', drawer.overflow <= 0, `${drawer.overflow}px`);
} finally {
  await page.close().catch(() => {});
  await browser.close().catch(() => {});
  server.close();
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} interaction checks passed`);
if (failed.length) process.exitCode = 1;

