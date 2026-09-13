import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PHONE } from './phone'

const TEXT_EXT = new Set(['.html', '.js', '.css', '.svg', '.md', '.json', '.txt', '.ts', '.tsx'])
const ROOTS = ['src', 'public', 'dist', 'readme-out', 'scripts', 'docs']

function* files(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* files(p)
    else if (TEXT_EXT.has(extname(p))) yield p
  }
}

describe('phone guard', () => {
  it('matches phone-shaped strings only', () => {
    expect(PHONE.test('call (555) 010-4477')).toBe(true)
    expect(PHONE.test('555.010.4477')).toBe(true)
    expect(PHONE.test('600,000 labeled waveforms')).toBe(false)
    expect(PHONE.test('2026.05-2026.08')).toBe(false)
  })

  it('no shipped or source text file contains a phone number', () => {
    const hits = ROOTS.filter(existsSync)
      .flatMap((root) => [...files(root)])
      .filter(
        (f) =>
          !f.endsWith('no-phone.test.ts') &&
          !f.includes('docs/superpowers/plans/') &&
          PHONE.test(readFileSync(f, 'utf8')),
      )
    expect(hits).toEqual([])
  })
})
