import { ASCII_NAME } from '../../src/data/ascii-name'
import { awards, certs, education, experience, identity, leadership, links, projects, services } from '../../src/data/profile'

const C = { bg: '#080808', fg: '#08f679', dim: '#089d46' }
const FS = 18
const LH = 26
const CH = FS * 0.6
const PROMPT = `${identity.handle}:~$`

export const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function svg(width: number, height: number, title: string, fontCss: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">
<title>${escapeXml(title)}</title>
<style>${fontCss}
text{font-family:'Google Sans Code',ui-monospace,monospace;font-size:${FS}px;fill:${C.fg};white-space:pre}
.dim{fill:${C.dim}}
</style>
<rect width="100%" height="100%" fill="${C.bg}"/>
${body}
</svg>
`
}

// Types a line out once. The clip rect's base width is the full line, so renderers without SMIL still show the text.
function typed(id: string, x: number, y: number, text: string, start: number, total: number) {
  const w = Math.ceil(text.length * CH * 1.1) + CH * 2
  const n = Math.min(Math.max(text.length, 1), 40)
  const values = ['0']
  const keyTimes = ['0']
  for (let i = 1; i <= n; i++) {
    values.push(((w * i) / n).toFixed(1))
    keyTimes.push(((start + 0.025 * i) / total).toFixed(4))
  }
  return `<clipPath id="${id}"><rect x="${x}" y="${y - FS}" width="${w}" height="${LH}"><animate attributeName="width" values="${values.join(';')}" keyTimes="${keyTimes.join(';')}" dur="${total}s" calcMode="discrete" fill="freeze"/></rect></clipPath>
<text x="${x}" y="${y}" clip-path="url(#${id})">${escapeXml(text)}</text>`
}

function cursor(x: number, y: number) {
  return `<rect x="${x}" y="${y - FS + 3}" width="${CH}" height="${FS + 2}" fill="${C.fg}"><animate attributeName="opacity" values="1;0" dur="1s" calcMode="discrete" repeatCount="indefinite"/></rect>`
}

function rain(x: number, y: number, height: number) {
  const glyphs = '01ab3f#9e7c$5d2+8=<4>6%a1'
  const rows = Math.ceil(height / 16) * 2
  const column = (dx: number, offset: number, dur: number) => {
    const tspans = Array.from({ length: rows }, (_, i) => {
      const opacity = ((i % 12) / 12 + 0.15).toFixed(2)
      return `<tspan x="${x + dx}" dy="16" fill-opacity="${opacity}">${escapeXml(glyphs[(i + offset) % glyphs.length])}</tspan>`
    }).join('')
    return `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 ${height}" dur="${dur}s" repeatCount="indefinite"/><text y="${y - height}" style="font-size:14px">${tspans}</text></g>`
  }
  return `<clipPath id="rain"><rect x="${x - 4}" y="${y}" width="36" height="${height}"/></clipPath><g clip-path="url(#rain)">${column(0, 0, 5)}${column(16, 7, 3.6)}</g>`
}

// ASCII_NAME is figlet "ANSI Shadow": 6 rows x 94 cols of block/box-drawing glyphs.
// NAME_FS/NAME_DY are tuned (not the plan's 11px/15.5px, sized for a 5-row "ANSI Regular" name)
// so the box-drawing strokes connect row-to-row with a tight line box.
const NAME_FS = 12
const NAME_DY = 9
const NAME_ROWS = ASCII_NAME.split('\n').length
const NAME_TOP = 126
const NAME_BOTTOM = NAME_TOP + (NAME_ROWS - 1) * NAME_DY + NAME_FS * 0.3

const pad = (s: string, width: number) => s.padEnd(width)

export function bannerSvg(fontCss: string) {
  const W = 1200
  const H = 400
  const name = ASCII_NAME.split('\n')
    .map((row, i) => `<tspan x="28" dy="${i === 0 ? 0 : NAME_DY}">${escapeXml(row)}</tspan>`)
    .join('')
  const rolesTop = NAME_BOTTOM + 42
  const role1Y = rolesTop
  const role2Y = rolesTop + 26
  const contactY = role2Y + 54

  // Right pane mirrors the site's nmap panel: a vertical divider around 60% width,
  // then `nmap -sV jason` typed above a PORT/STATE/SERVICE table of profile.ts services.
  // Nudged past 60% (the rendered ASCII name reaches ~x=757) so the two never overlap.
  const divX = Math.round(W * 0.65)
  const nmapX = divX + 28
  const nmapCmdY = 92
  const nmapHeaderY = 150
  const nmapRows: { text: string; dim?: boolean }[] = [
    { text: `${pad('PORT', 10)}${pad('STATE', 7)}SERVICE`, dim: true },
    ...services.map((s) => ({ text: `${pad(s.port, 10)}${pad('open', 7)}${s.service}` })),
  ]
  const nmapTable = nmapRows
    .map((r, i) => `<text x="${nmapX}" y="${nmapHeaderY + i * LH}"${r.dim ? ' class="dim"' : ''}>${escapeXml(r.text)}</text>`)
    .join('\n')

  const body = `<rect x="8" y="8" width="${W - 16}" height="40" fill="none" stroke="${C.fg}" stroke-width="1.5"/>
<text x="24" y="34">[0]  ${escapeXml(`${identity.handle}: ~`)}</text>
<text x="${W / 2}" y="34" text-anchor="middle">${escapeXml(identity.certsShort.join(' | '))}</text>
<text x="${W - 24}" y="34" text-anchor="end" class="dim">jasonsonith.github.io</text>
${typed('t0', 28, 92, `${PROMPT} whoami`, 0.2, 4)}
<text y="${NAME_TOP}" style="font-size:${NAME_FS}px">${name}</text>
${typed('t1', 28, role1Y, identity.roles[0], 1.3, 4)}
${typed('t2', 28, role2Y, identity.roles[1], 1.8, 4)}
${typed('t3', 28, contactY, `${PROMPT} ./contact.sh`, 2.4, 4)}
${cursor(28 + (PROMPT.length + 14) * CH, contactY)}
<rect x="${divX}" y="56" width="1" height="${H - 72}" fill="${C.dim}"/>
${typed('t4', nmapX, nmapCmdY, 'nmap -sV jason', 0.2, 4)}
${nmapTable}
${rain(W - 52, 60, H - 76)}`
  const alt = `Terminal: whoami prints ${identity.name}, ${identity.roles.join(', ')}. nmap -sV jason: ${services.map((s) => s.service).join(', ')}.`
  return svg(W, H, alt, fontCss, body)
}

function panel(title: string, command: string, lines: { text: string; dim?: boolean }[], fontCss: string) {
  const W = 590
  const H = 70 + Math.max(lines.length, 7) * LH
  const body = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${C.dim}" stroke-width="1.5"/>
<text x="20" y="36"><tspan class="dim">${escapeXml(PROMPT)} </tspan>${escapeXml(command)}</text>
${lines.map((l, i) => `<text x="20" y="${76 + i * LH}"${l.dim ? ' class="dim"' : ''}>${escapeXml(l.text)}</text>`).join('\n')}`
  return svg(W, H, title, fontCss, body)
}

export function experienceSvg(fontCss: string) {
  const lines = experience.flatMap((e) => [
    { text: `${pad(e.periodShort, 12)}${e.orgShort}` },
    { text: `${' '.repeat(12)}${e.role}`, dim: true },
  ])
  const title = `experience.log: ${experience.map((e) => `${e.role} at ${e.org} (${e.period})`).join('; ')}`
  return panel(title, 'cat experience.log', lines, fontCss)
}

// Wraps text to fit the panel's usable width so long award lines don't clip off the right edge.
function wrap(text: string, maxChars: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

export function certsSvg(fontCss: string) {
  const items = [...certs, ...awards]
  const lines = items.flatMap((c) => wrap(c, 48))
  return panel(`certs.txt: ${items.join('; ')}`, 'cat certs.txt', lines.map((text) => ({ text })), fontCss)
}

export const BUTTONS = [
  { file: 'btn-contact.svg', label: '[1] contact', href: links.email },
  { file: 'btn-resume.svg', label: '[2] resume.pdf', href: links.resumeAbsolute },
  { file: 'btn-site.svg', label: '[3] site', href: links.site },
  { file: 'btn-linkedin.svg', label: '[4] linkedin', href: links.linkedin },
]

export function buttonSvg(label: string, fontCss: string) {
  const W = Math.ceil(label.length * CH) + 40
  return svg(W, 44, label, fontCss, `<rect width="${W}" height="44" fill="${C.fg}"/><text x="20" y="28" style="fill:${C.bg}">${escapeXml(label)}</text>`)
}

export function readmeMarkdown() {
  const buttons = BUTTONS.map((b) => `  <a href="${b.href}"><img src="assets/${b.file}" alt="${escapeXml(b.label)}" height="40"></a>`).join('\n')
  const projectRows = projects
    .map((p) => `| ${p.repo ? `[${p.name}](${p.repo})` : `**${p.name}**`} | ${p.summary} | ${p.stack.join(', ')} |`)
    .join('\n')
  const exp = experience
    .map((e) => `- **${e.role}**, ${e.org} (${e.period})\n${e.points.map((pt) => `  - ${pt}`).join('\n')}`)
    .join('\n')
  const edu = education.map((e) => `- **${e.school}**: ${e.degree} (${e.period})${e.detail ? `, ${e.detail}` : ''}`).join('\n')
  const lead = leadership.map((l) => `- **${l.title}**, ${l.org} (${l.period}): ${l.point}`).join('\n')

  const certItems = [...certs, ...awards]
  return `<!-- Generated by jasonsonith.github.io/scripts/readme. Edit src/data/profile.ts, then run npm run readme. -->
<p align="center">
  <img src="assets/banner.svg" alt="Terminal: whoami prints ${escapeXml(identity.name)}, ${escapeXml(identity.roles.join(', '))}. nmap -sV jason: ${escapeXml(services.map((s) => s.service).join(', '))}." width="100%">
</p>

<p align="center">
${buttons}
</p>

<p align="center">
  <img src="assets/experience.svg" alt="cat experience.log: ${escapeXml(experience.map((e) => `${e.role}, ${e.org}`).join('; '))}" width="49%">
  <img src="assets/certs.svg" alt="cat certs.txt: ${escapeXml(certItems.join('; '))}" width="49%">
</p>

### \`cat experience.log --verbose\`

${exp}

### \`ls -la ~/projects\`

| project | what | stack |
|---|---|---|
${projectRows}

### \`cat certs.txt\`

${certItems.map((c) => `- ${c}`).join('\n')}

### \`cat education.txt\`

${edu}

### \`history | grep leadership\`

${lead}
`
}
