/**
 * Behaviour check for the Abyss / Orbital reskin.
 *
 * Drives the reskinned site in real Chrome (desktop 1440x900 + mobile 390x844)
 * and exercises every interactive path the old shell exposed: dial navigation,
 * registry search / lane / sort, receipt filters and expansion, wallet connect,
 * council voting, the stake stepper and the registration form.
 *
 * Usage: node .reskin/interactions.mjs [baseUrl]
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const BASE = process.argv[2] || 'http://127.0.0.1:4422/'
const req = createRequire(path.join(process.cwd(), '.reskin', 'tools', 'package.json'))
const { chromium } = req('playwright-core')

const CHROME = process.env.RESKIN_CHROME
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail })
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const runtimeErrors = []

/* ---------------------------------------------------------------- desktop -- */
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
desktop.on('console', (m) => { if (m.type() === 'error') runtimeErrors.push(m.text()) })
desktop.on('pageerror', (e) => runtimeErrors.push(String(e)))
await desktop.goto(BASE, { waitUntil: 'networkidle' })
await desktop.waitForTimeout(500)

// dial navigation
await desktop.click('.ab-node-link[href="#registry"]')
await desktop.waitForTimeout(900)
const scrolledToRegistry = await desktop.evaluate(() => {
  const r = document.getElementById('registry')?.getBoundingClientRect()
  return r ? Math.abs(r.top) < 220 : false
})
check('dial node scrolls to registry', scrolledToRegistry)
const litNode = await desktop.$eval('.ab-node-link--lit', (el) => el.getAttribute('href')).catch(() => null)
check('active node follows the page', litNode === '#registry', String(litNode))

// registry search
await desktop.fill('.ab-search-input', 'Kestrel')
await desktop.waitForTimeout(250)
let cards = await desktop.$$('.ab-record')
check('search filters to one agent', cards.length === 1, `${cards.length} cards`)
await desktop.fill('.ab-search-input', '')
await desktop.waitForTimeout(200)

// lane filter (idle = Nimbus Kiln only)
const idleLane = desktop.locator('.ab-lane', { hasText: /^idle$/ })
await idleLane.click()
await desktop.waitForTimeout(250)
cards = await desktop.$$('.ab-record')
const idleName = await desktop.$eval('.ab-record-name', (el) => el.textContent.trim()).catch(() => '')
check('idle lane isolates the idle agent', cards.length === 1 && idleName === 'Nimbus Kiln', `${cards.length} / ${idleName}`)
await desktop.locator('.ab-lane', { hasText: /^all$/ }).click()
await desktop.waitForTimeout(200)

// sort by success (highest first = Nimbus 99.9)
await desktop.locator('.ab-sort', { hasText: /^success$/ }).click()
await desktop.waitForTimeout(250)
const firstAfterSort = await desktop.$eval('.ab-record-name', (el) => el.textContent.trim())
check('success sort ranks the 99.9% agent first', firstAfterSort === 'Orrin Vale', firstAfterSort)

// receipt filter + expansion
await desktop.locator('.ab-chip', { hasText: /^failed$/ }).click()
await desktop.waitForTimeout(250)
let receiptRows = await desktop.$$('.ab-receipt')
check('failed filter isolates one receipt', receiptRows.length === 1, `${receiptRows.length} rows`)
await desktop.click('.ab-receipt-line')
await desktop.waitForTimeout(400)
const detailVisible = await desktop.isVisible('.ab-receipt-detail')
const detailText = detailVisible ? await desktop.$eval('.ab-receipt-detail', (el) => el.innerText) : ''
check('receipt expands with its hashes', detailVisible && /input_hash/i.test(detailText) && /output_hash/i.test(detailText))
await desktop.locator('.ab-chip', { hasText: /^all$/ }).click()
await desktop.waitForTimeout(200)

// wallet connect flow
await desktop.click('.ab-hud-wallet')
await desktop.waitForTimeout(400)
check('wallet docket opens', await desktop.isVisible('.ab-sheet'))
await desktop.click('.ab-wallet-opt:has-text("Phantom")')
await desktop.waitForTimeout(350)
const signRows = await desktop.$eval('.ab-sign-rows', (el) => el.innerText).catch(() => '')
check('signature review lists program / fee payer / fee', /program/i.test(signRows) && /fee payer/i.test(signRows) && /0\.000005 SOL/.test(signRows))
await desktop.click('.ab-sign-actions .ab-btn--prime')
await desktop.waitForTimeout(500)
const walletLabel = await desktop.$eval('.ab-hud-wallet', (el) => el.innerText.trim())
check('approve connects the signer', walletLabel.toLowerCase() === 'phantom', walletLabel)
check('toast reports the connection', await desktop.isVisible('.ab-toast'))

// council vote
await desktop.locator('.ab-ballot', { hasText: 'ST-14' }).locator('.ab-vote', { hasText: /yes/ }).first().click()
await desktop.waitForTimeout(300)
const ballotText = await desktop.locator('.ab-ballot', { hasText: 'ST-14' }).innerText()
check('vote flips to voted yes + recorded', /voted yes/i.test(ballotText) && /recorded/i.test(ballotText))

// stake stepper
const before = await desktop.$eval('.ab-step-input', (el) => el.value)
await desktop.click('.ab-step[aria-label="Increase"]')
await desktop.waitForTimeout(200)
const after = await desktop.$eval('.ab-step-input', (el) => el.value)
check('stake stepper increments', Number(after) === Number(before) + 50, `${before} -> ${after}`)

// registration form
await desktop.fill('.ab-input[placeholder="e.g. Kestrel Drift"]', 'Test Relay')
await desktop.click('.ab-panel--form button[type="submit"]')
await desktop.waitForTimeout(900)
const transcript = await desktop.$eval('.ab-term-body', (el) => el.innerText)
check('registration writes a result line into the transcript', /result \//.test(await desktop.$eval('.ab-term-foot', (el) => el.innerText)))

// anchors + links
const hashLinks = await desktop.$$eval('.ab-node-link', (els) => els.map((e) => e.getAttribute('href')))
check('five dial anchors expose section hashes', hashLinks.length === 5 && hashLinks.every((h) => h.startsWith('#')), hashLinks.join(' '))

/* ----------------------------------------------------------------- mobile -- */
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
mobile.on('console', (m) => { if (m.type() === 'error') runtimeErrors.push(m.text()) })
mobile.on('pageerror', (e) => runtimeErrors.push(String(e)))
await mobile.goto(BASE, { waitUntil: 'networkidle' })
await mobile.waitForTimeout(500)

const overflow = await mobile.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth
}))
check('390px has no horizontal overflow', overflow.scrollWidth <= overflow.clientWidth + 2, `${overflow.scrollWidth}/${overflow.clientWidth}`)

const visibleAnchors = await mobile.$$eval('.ab-node-link', (els) => els.filter((el) => {
  const r = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'
}).length)
check('mobile bar keeps the section anchors visible', visibleAnchors === 5, `${visibleAnchors} visible`)

await mobile.click('.ab-dock-toggle')
await mobile.waitForTimeout(400)
const drawerRows = await mobile.$$('.ab-drawer-row')
check('dock toggle opens the drawer with five rows', drawerRows.length === 5, `${drawerRows.length} rows`)
await mobile.click('.ab-drawer-row:has-text("Vault")')
await mobile.waitForTimeout(250)
check('drawer closes after picking a section', (await mobile.$$('.ab-drawer-row')).length === 0)
await mobile.waitForFunction(() => {
  const r = document.getElementById('vault')?.getBoundingClientRect()
  return !!r && Math.abs(r.top) < 240
}, null, { timeout: 6000 }).catch(() => {})
const mobileScrolled = await mobile.evaluate(() => {
  const r = document.getElementById('vault')?.getBoundingClientRect()
  return r ? Math.abs(r.top) < 240 : false
})
check('drawer row navigates to the vault', mobileScrolled)

await mobile.click('.ab-dock-toggle')
await mobile.waitForTimeout(300)
const reopened = (await mobile.$$('.ab-drawer-row')).length
await mobile.click('.ab-dock-toggle')
await mobile.waitForTimeout(300)
const closedAgain = (await mobile.$$('.ab-drawer-row')).length
check('dock toggle opens and closes the drawer', reopened === 5 && closedAgain === 0, `${reopened} -> ${closedAgain}`)

/* ---------------------------------------------------------------- summary -- */
await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (runtimeErrors.length) {
  console.log(`runtime errors (${runtimeErrors.length}):`)
  for (const err of runtimeErrors.slice(0, 10)) console.log(`  - ${err.slice(0, 220)}`)
}
process.exit(failed.length || runtimeErrors.length ? 1 : 0)
