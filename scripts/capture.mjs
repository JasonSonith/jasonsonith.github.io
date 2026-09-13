import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const url = process.env.CAPTURE_URL ?? 'http://localhost:4173/'
const out = '.impeccable/review'
const which = process.argv[2] ?? 'all'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()

async function shot(name, viewport, { dpr = 1, fullPage = false } = {}) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: dpr, reducedMotion: 'reduce' })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage })
  await page.close()
  console.log(`captured ${out}/${name}.png`)
}

if (which === 'hero' || which === 'all') await shot('hero-repro', { width: 1344, height: 760 }, { dpr: 2 })
if (which === 'responsive' || which === 'all') {
  await shot('desktop', { width: 1440, height: 815 }, { fullPage: true })
  await shot('mobile', { width: 390, height: 844 }, { fullPage: true })
  await shot('user-1280', { width: 1280, height: 800 })
}
await browser.close()
