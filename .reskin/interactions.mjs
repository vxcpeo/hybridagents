import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.resolve('.reskin/tools/package.json'))
const { chromium } = require('playwright-core')

const base = process.argv[2] || 'http://127.0.0.1:4901/'
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ headless: true, executablePath: chrome, args: ['--no-sandbox', '--hide-scrollbars'] })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

let failures = 0
const log = (name, ok, extra = '') => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` — ${extra}` : ''}`)
}

await page.goto(base, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(900)

// 1. index navigation
await page.click('.contents-link[href="#ledger"]')
await page.waitForTimeout(1200)
const ledgerTop = await page.evaluate(() => Math.round(document.getElementById('ledger').getBoundingClientRect().top))
log('index link scrolls to #ledger', Math.abs(ledgerTop) < 120, `top=${ledgerTop}`)
const activeLabel = await page.evaluate(() => document.querySelector('.contents-link.is-current')?.textContent?.trim())
log('active index entry follows scroll', activeLabel === 'Ledger', `active=${activeLabel}`)

// 2. wallet sheet flow
await page.click('.tool-connect')
await page.waitForTimeout(400)
log('wallet sheet opens', await page.locator('.sheet[role="dialog"]').isVisible())
await page.click('.wallet >> nth=0')
await page.waitForTimeout(350)
log('wallet pick advances to signature step', await page.locator('.sign-card').isVisible())
const signRows = await page.locator('.sign-rows dt').allInnerTexts()
log('signature step lists program/fee/network rows', signRows.length === 3, signRows.join('|'))
await page.click('.sign-actions .press >> nth=0')
await page.waitForTimeout(600)
const toastText = await page.locator('.notice').innerText()
const connectLabel = await page.locator('.tool-connect').innerText()
log('approve connects a wallet and raises notice', /Phantom connected/.test(toastText) && /Phantom/.test(connectLabel), `notice="${toastText.replace(/\n/g, ' ')}"`)

// 3. registry search + lanes + sort
await page.fill('.search-line input', 'kestrel')
await page.waitForTimeout(300)
const searchRows = await page.locator('.register .agent').count()
log('registry search filters rows', searchRows === 1, `rows=${searchRows}`)
await page.fill('.search-line input', 'zzzz')
await page.waitForTimeout(300)
log('registry empty state renders', await page.locator('.agent-empty').isVisible())
await page.fill('.search-line input', '')
await page.waitForTimeout(300)
await page.click('.state-tab >> nth=2')
await page.waitForTimeout(300)
const laneRows = await page.locator('.register .agent').count()
log('registry lane filter works', laneRows >= 1 && laneRows < 6, `rows=${laneRows}`)
await page.click('.state-tab >> nth=0')
await page.click('.rank >> nth=1')
await page.waitForTimeout(300)
const sortedFirst = await page.locator('.register .agent .agent-name').first().innerText()
log('registry sort by success works', sortedFirst === 'Orrin Vale', `first=${sortedFirst}`)

// 4. ledger filter + row expansion
await page.click('.receipt-log .range button >> nth=2')
await page.waitForTimeout(300)
const failedRows = await page.locator('.receipt').count()
log('receipt filter shows failed rows', failedRows === 1, `rows=${failedRows}`)
await page.click('.receipt-log .range button >> nth=0')
await page.waitForTimeout(200)
await page.click('.receipt-line >> nth=0')
await page.waitForTimeout(350)
log('receipt row expands detail', await page.locator('.receipt-detail').isVisible())
const detailText = await page.locator('.receipt-detail').innerText()
log('receipt detail carries hashes', /input_hash/i.test(detailText) && /output_hash/i.test(detailText))
const explorerHref = await page.getAttribute('.explorer', 'href')
log('explorer link keeps cluster target', /explorer\.solana\.com\/address\/6tdNLcioiV74gMXLyHLLdxhfibTVxqd6pLUUmgEncXcs\?cluster=devnet/.test(explorerHref), explorerHref)

// 5. council voting
await page.click('.ballot >> nth=0 >> .vote >> nth=0')
await page.waitForTimeout(300)
const voteLabels = await page.locator('.ballot >> nth=0 >> .vote').allInnerTexts()
const stamp = await page.locator('.ballot-stamp >> nth=0').innerText()
log('council vote records locally', /voted yes/.test(voteLabels[0]) && /recorded/.test(stamp), `labels=${voteLabels.join('|')}`)

// 6. stake stepper + action
const before = await page.inputValue('.amount-stepper input')
await page.click('.step >> nth=1')
await page.waitForTimeout(200)
const after = await page.inputValue('.amount-stepper input')
log('stake stepper increments amount', Number(after) === Number(before) + 50, `${before} -> ${after}`)
await page.click('.stake-actions .press >> nth=0')
await page.waitForTimeout(400)
log('stake action raises queued notice', /Queued/.test(await page.locator('.notice').innerText()))

// 7. registration form validation + submit
await page.click('.questionnaire button[type="submit"]')
await page.waitForTimeout(300)
const formValid = await page.evaluate(() => document.querySelector('.questionnaire input[placeholder="e.g. Kestrel Drift"]').checkValidity())
log('registration form blocks empty codename', formValid === false)
await page.fill('.questionnaire input[placeholder="e.g. Kestrel Drift"]', 'Probe Agent')
await page.click('.questionnaire button[type="submit"]')
await page.waitForTimeout(1500)
const resultLine = await page.locator('.transcript-foot').innerText()
log('registration writes a result line', /result \/|waiting for a registration/.test(resultLine), `foot="${resultLine.replace(/\n/g, ' ')}"`)

// 8. mobile contents drawer + visible anchors
await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(500)
const mobileAnchors = await page.locator('.contents-link').count()
const anchorsVisible = await page.locator('.contents-link').first().isVisible()
log('mobile index anchors stay visible', mobileAnchors === 5 && anchorsVisible, `count=${mobileAnchors}`)
await page.click('.tool-menu')
await page.waitForTimeout(400)
const drawerRows = await page.locator('.mast-drawer .drawer-row').count()
const expanded = await page.getAttribute('.tool-menu', 'aria-expanded')
log('mobile contents drawer opens', drawerRows === 5 && expanded === 'true', `rows=${drawerRows} expanded=${expanded}`)

// 9. keyboard focus visible
await page.setViewportSize({ width: 1440, height: 900 })
await page.waitForTimeout(300)
await page.evaluate(() => document.activeElement?.blur?.())
await page.keyboard.press('Tab')
const focusOutline = await page.evaluate(() => {
  const cs = getComputedStyle(document.activeElement)
  return `${cs.outlineStyle} ${cs.outlineWidth}`
})
log('keyboard focus visible', /solid/.test(focusOutline), focusOutline)

log('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '))

await browser.close()
console.log(failures === 0 ? 'ALL INTERACTIONS PASS' : `${failures} INTERACTION FAILURE(S)`)
process.exitCode = failures === 0 ? 0 : 1
