// Matches phone-shaped strings generically:
//  - separated forms: optional +1/1 prefix, optional parens, dashes/dots/spaces/unicode dashes as separators
//  - compact (unseparated) 10-digit forms: restricted to NANP-valid area/exchange codes (first digit 2-9)
//  - tel: URIs
const DASH = '\\u2010-\\u2015\\u2212'
const SEP_CHARS = `-.\\s${DASH}`
const SEP = `[${SEP_CHARS}]`
const SEPARATED = `(?:\\+?1${SEP}?)?\\(?\\b\\d{3}\\)?${SEP}?\\d{3}${SEP}\\d{4}\\b`
const COMPACT = `\\+?\\b(?:1)?[2-9]\\d{2}[2-9]\\d{2}\\d{4}\\b`
const TEL_URI = `\\btel:\\+?[\\d${SEP_CHARS}()]{7,15}`

function source(compact: boolean) {
  const parts = compact ? [SEPARATED, COMPACT, TEL_URI] : [SEPARATED, TEL_URI]
  return parts.map((p) => `(?:${p})`).join('|')
}

export const PHONE = new RegExp(source(true), 'i')

// NANP reserved fictional range: any area code, exchange 555, subscriber 0100-0199.
function isFictional(digits: string) {
  const exchange = digits.slice(-7, -4)
  const subscriber = digits.slice(-4)
  return exchange === '555' && subscriber >= '0100' && subscriber <= '0199'
}

// Returns phone-shaped matches in text, excluding the NANP fictional range (555-0100..0199).
// Pass { compact: false } to skip the unseparated 10-digit form (e.g. for minified JS, where an
// arbitrary NANP-valid-looking 10-digit run can occur in numeric constants).
export function findPhones(text: string, opts: { compact?: boolean } = {}): string[] {
  const matches = text.match(new RegExp(source(opts.compact ?? true), 'gi')) ?? []
  return matches.filter((m) => {
    const digits = m.replace(/\D/g, '')
    return digits.length < 10 || !isFictional(digits)
  })
}
