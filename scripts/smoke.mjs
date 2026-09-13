import { chromium } from 'playwright'
import { COMMANDS } from '../src/lib/commands.ts'

const url = process.env.CAPTURE_URL ?? 'http://localhost:4173/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1344, height: 760 } })
await page.goto(url, { waitUntil: 'networkidle' })

const fail = (msg) => {
  console.error(`FAIL ${msg}`)
  process.exitCode = 1
}

const targets = COMMANDS.filter((c) => c.action.kind === 'scroll').map((c) => c.action.target)
const missing = await page.evaluate((ids) => ids.filter((id) => !document.getElementById(id)), targets)
if (missing.length) fail(`command targets missing from the page: ${missing.join(', ')}`)

await page.keyboard.press('Control+k')
await page.keyboard.type('projects')
await page.keyboard.press('Enter')
await page.waitForTimeout(1000)
const top = await page.evaluate(() => document.getElementById('projects').getBoundingClientRect().top)
if (Math.abs(top) > 40) fail(`projects not scrolled into view (top=${top})`)

await page.keyboard.press('Control+k')
await page.keyboard.type('nope')
if (!(await page.getByText('command not found: nope').isVisible())) fail('unknown command message missing')
await page.keyboard.press('Escape')
await page.waitForSelector('[role="dialog"]', { state: 'detached' })

await page.keyboard.press('Control+k')
await page.keyboard.type('ls')
await page.keyboard.press('ArrowDown')
const highlighted = await page.locator('[cmdk-item][data-selected="true"]').innerText()
await page.keyboard.press('Enter')
await page.waitForTimeout(1000)
const expected = highlighted.split('\n')[0].trim()
const scrolled = await page.evaluate((id) => Math.abs(document.getElementById(id)?.getBoundingClientRect().top ?? 999), expected)
if (scrolled > 40) fail(`Enter did not run the highlighted command "${expected}" (top=${scrolled})`)
if (await page.locator('[role="dialog"]').count()) await page.keyboard.press('Escape')
await page.waitForSelector('[role="dialog"]', { state: 'detached' })

await page.keyboard.press('Control+k')
await page.locator('[cmdk-list]').click()
const popups = []
page.on('popup', (p) => popups.push(p))
await page.keyboard.press('3')
await page.waitForTimeout(500)
if (popups.length) fail('hotkey fired while the command palette was open')
await page.keyboard.press('Escape')
await page.waitForSelector('[role="dialog"]', { state: 'detached' })
page.removeAllListeners('popup')

const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('3')])
if (!popup.url().startsWith('https://github.com/JasonSonith')) fail(`hotkey 3 opened ${popup.url()}`)

await browser.close()
if (!process.exitCode) console.log('smoke ok')
