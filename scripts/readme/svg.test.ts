import { describe, expect, it } from 'vitest'
import { experience, projects, services } from '../../src/data/profile'
import { PHONE } from '../../tests/phone'
import { BUTTONS, bannerSvg, buttonSvg, escapeXml, experienceSvg, nmapSvg, readmeMarkdown } from './svg'

const wellFormed = (svg: string) => {
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
  expect(svg).not.toMatch(/&(?!amp;|lt;|gt;|quot;|#\d+;)/)
}

describe('escapeXml', () => {
  it('escapes markup characters', () => {
    expect(escapeXml('a & <b> "c"')).toBe('a &amp; &lt;b&gt; &quot;c&quot;')
  })
})

describe('svg panels', () => {
  it('banner shows the prompt, ascii name, and roles, and stays visible without animation', () => {
    const svg = bannerSvg('')
    wellFormed(svg)
    expect(svg).toContain('whoami')
    expect(svg).toContain('█')
    expect(svg).toContain('Penetration Tester / Product Security')
    expect(svg).not.toMatch(/<clipPath[^>]*><rect[^>]*width="0"/)
  })

  it('experience panel lists every role', () => {
    const svg = experienceSvg('')
    wellFormed(svg)
    for (const e of experience) expect(svg).toContain(escapeXml(e.role))
  })

  it('nmap panel lists every service', () => {
    const svg = nmapSvg('')
    wellFormed(svg)
    for (const s of services) expect(svg).toContain(s.service)
  })

  it('buttons render their label', () => {
    for (const b of BUTTONS) {
      const svg = buttonSvg(b.label, '')
      wellFormed(svg)
      expect(svg).toContain(escapeXml(b.label))
    }
  })
})

describe('readmeMarkdown', () => {
  const md = readmeMarkdown()

  it('links every button target and every project', () => {
    for (const b of BUTTONS) expect(md).toContain(`href="${b.href}"`)
    for (const p of projects) expect(md).toContain(p.name)
  })

  it('references every asset with alt text', () => {
    for (const f of ['banner.svg', 'experience.svg', 'nmap.svg', ...BUTTONS.map((b) => b.file)]) {
      expect(md).toMatch(new RegExp(`src="assets/${f.replace('.', '\\.')}" alt="[^"]+"`))
    }
  })

  it('contains no phone number', () => {
    expect(PHONE.test(md)).toBe(false)
  })
})
