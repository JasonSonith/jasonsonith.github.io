import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

// GitHub's README markdown becomes plain HTML; simulate that instead of `page.setContent`,
// which serves an about:blank origin that Chromium refuses to load file:// images into.
const md = readFileSync('readme-out/README.md', 'utf8')
const html = `<body style="background:#0d1117;margin:0;padding:24px;color:#e6edf3;font-family:sans-serif">${md}</body>`
writeFileSync('readme-out/preview.html', html)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1012, height: 1400 } })
await page.goto(`file://${process.cwd()}/readme-out/preview.html`)
await page.waitForTimeout(4500)
await page.screenshot({ path: '.impeccable/review/readme-github.png', fullPage: true })
await browser.close()
console.log('captured .impeccable/review/readme-github.png')
