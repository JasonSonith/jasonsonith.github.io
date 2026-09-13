import { mkdirSync, writeFileSync } from 'node:fs'
import { embeddedFontCss } from './font'
import { BUTTONS, bannerSvg, buttonSvg, certsSvg, experienceSvg, readmeMarkdown } from './svg'

const OUT = 'readme-out'
mkdirSync(`${OUT}/assets`, { recursive: true })

const builds: [string, (css: string) => string][] = [
  ['banner.svg', bannerSvg],
  ['experience.svg', experienceSvg],
  ['certs.svg', certsSvg],
  ...BUTTONS.map((b): [string, (css: string) => string] => [b.file, (css) => buttonSvg(b.label, css)]),
]

for (const [file, build] of builds) {
  const css = await embeddedFontCss(build(''))
  writeFileSync(`${OUT}/assets/${file}`, build(css))
  console.log(`wrote ${OUT}/assets/${file}`)
}
writeFileSync(`${OUT}/README.md`, readmeMarkdown())
console.log(`wrote ${OUT}/README.md`)
