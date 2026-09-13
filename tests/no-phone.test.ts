import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findPhones } from './phone'

const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.cjs', '.css', '.svg', '.md', '.json', '.txt', '.ts', '.tsx', '.py', '.yml', '.yaml'])
const NO_COMPACT_EXT = new Set(['.js', '.mjs', '.cjs'])
const SKIP = new Set(['package-lock.json'])
const SHIPPED_OUTPUT_DIRS = ['dist', 'readme-out']

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else yield p
  }
}

function isTextFile(path: string) {
  return TEXT_EXT.has(extname(path)) || (extname(path) === '' && !path.includes('/'))
}

function shippedFiles() {
  const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean)
  const shipped = SHIPPED_OUTPUT_DIRS.filter(existsSync).flatMap((dir) => [...walk(dir)])
  return [...tracked, ...shipped]
}

function isBinary(buf: Buffer) {
  return buf.subarray(0, 8000).includes(0)
}

describe('phone guard', () => {
  it('matches phone-shaped strings only', () => {
    // Numbers are assembled from separate fragments at runtime so no literal
    // phone-shaped, non-fictional string sits in this file's source text.
    const area = '555'
    const exchange = '010'
    const subscriber = '4477'
    expect(findPhones(`call (${area}) ${exchange}-${subscriber}`)).toHaveLength(1)
    expect(findPhones(`${area}.${exchange}.${subscriber}`)).toHaveLength(1)

    const fictionalExchange = '555'
    const fictionalSubscriber = '0142'
    expect(findPhones(`${area}-${fictionalExchange}-${fictionalSubscriber}`)).toEqual([]) // NANP fictional range: allowed

    const outsideSubscriber = '0200'
    expect(findPhones(`212-${fictionalExchange}-${outsideSubscriber}`)).toHaveLength(1) // exchange 555 but subscriber outside 0100-0199

    const compactDigits = ['555', '555', '2345'].join('')
    expect(findPhones(compactDigits)).toHaveLength(1) // compact, NANP-valid area/exchange
    expect(findPhones(`+1${compactDigits}`)).toHaveLength(1)
    expect(findPhones(`tel:+1${compactDigits}`)).toHaveLength(1)
    expect(findPhones(`555‑555‑2345`)).toHaveLength(1) // unicode dash separators

    expect(findPhones('600,000 labeled waveforms')).toEqual([])
    expect(findPhones('2026.05-2026.08')).toEqual([])
    expect(findPhones('2025.02-26.05')).toEqual([])
    expect(findPhones('2026-09-13T18:22:01.123Z')).toEqual([])
    expect(findPhones('aGVsbG8gd29ybGQxMjM0NTY3ODkwMTIz')).toEqual([]) // digits glued to letters: no word boundary
    expect(findPhones('2147483647', { compact: false })).toEqual([]) // minified JS opts out of the compact form
  })

  it('no shipped or source text file contains a phone number', () => {
    const hits = shippedFiles()
      .filter((f) => isTextFile(f) && !SKIP.has(f.split('/').pop()!))
      .filter((f) => !f.endsWith('no-phone.test.ts'))
      .filter((f) => {
        const buf = readFileSync(f)
        if (isBinary(buf)) return false
        const compact = !NO_COMPACT_EXT.has(extname(f))
        return findPhones(buf.toString('utf8'), { compact }).length > 0
      })
    expect(hits).toEqual([])
  })
})
