import { chromium } from 'playwright'

const url = process.env.CAPTURE_URL ?? 'http://localhost:4173/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1344, height: 760 } })
await page.goto(url, { waitUntil: 'networkidle' })

const fail = (msg) => {
  console.error(`FAIL ${msg}`)
  process.exitCode = 1
}

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

const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('3')])
if (!popup.url().startsWith('https://github.com/JasonSonith')) fail(`hotkey 3 opened ${popup.url()}`)

await browser.close()
if (!process.exitCode) console.log('smoke ok')
