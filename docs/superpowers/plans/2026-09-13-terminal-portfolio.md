# Terminal Portfolio + GitHub Profile README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline; per the user's CLAUDE.md the author implements, subagents only review). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a green-terminal portfolio at `jasonsonith.github.io` and a matching animated GitHub profile README, both generated from one profile data file.

**Architecture:** Vite + React SPA styled as a tmux session. The first viewport is built comp-led against `.impeccable/mocks/terminal-tmux.png` using impeccable's measured build phases (spec and plates already closed; hero is open). `src/data/profile.ts` feeds both the site and a Node generator that writes SVG panels plus `README.md` for the `JasonSonith/JasonSonith` repo. GitHub Actions deploys the site to Pages.

**Tech Stack:** Node 20, Vite 8, React 19, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`), shadcn/ui (Command, Dialog, Accordion, Button), cmdk, `@fontsource/google-sans-code`, Vitest 5, Playwright 1.63, figlet 1.11 (build-time only), subset-font 2.7, tsx, Python 3 + PyMuPDF 1.28 (resume redaction).

**Spec:** `docs/superpowers/specs/2026-09-13-terminal-portfolio-design.md`

## Global Constraints

- Project root: `/home/sonit/jasonsonith-portfolio`. Impeccable CLI: `I=/home/sonit/.claude/plugins/marketplaces/impeccable/plugin/skills/impeccable/scripts/impeccable`.
- Content facts come only from `PRODUCT.md`. No invented metrics, claims, availability statements, or CTF placements.
- The phone number is never published: not in the site, README, resume copy, source, tests, or docs. Guards detect phone-shaped strings generically; the real number never appears in any file.
- Palette (sampled from comp): ground `#080808`, phosphor `#08f679`, dim `#089d46`, faint `#083211`. No gradients, no glow, no rounded corners (`--radius: 0`).
- One typeface: Google Sans Code (fontsource), weights 400 and 700. Advance 0.6em, cap height 0.716em. It contains the block glyphs (`█`) the ASCII name needs (latin + symbols2 subsets).
- Comp breakpoint 2688x1520 = CSS viewport 1344x760 at deviceScaleFactor 2. Measured: body cap 28.7px comp (14.35 CSS px, font-size about 20px, 1.49vw); body line step 3.87% of height; ASCII name 94 columns x 5 rows, width 56.6% of viewport, rows 19.2 CSS px.
- Hero words are copied verbatim from the comp until the hero gate passes; the stated rewrite (accurate default ports) follows in Task 8. The comp's fixed timestamp is rendered as a live clock from the start.
- Conventional commits with the attribution lines from the session reminder.
- Pushing: never use the pasted `_gh_sess` cookie. Token lives in `~/.github_token.env` (`GITHUB_PERSONAL_ACCESS_TOKEN`, scopes repo/user/workflow). Git pushes pass it through an inline credential helper, never stored in `.git/config`. GitHub MCP is used for repo metadata when it is connected.
- Outward-facing steps (repo creation, pushes, Pages) wait for an explicit user go-ahead at the Task 10 checkpoint.

## File Map

| Path | Responsibility |
|---|---|
| `src/data/profile.ts` | Every fact: identity, links, experience, services, projects, certs, education, leadership, skills |
| `src/data/ascii-name.ts` | Generated ASCII art (`ASCII_NAME`, `ASCII_NAME_STACKED`) |
| `src/lib/commands.ts` | Command registry and `resolveCommand` (pure) |
| `src/lib/perform.ts` | Executes a `CommandAction` in the browser |
| `src/lib/clock.ts` | `formatClock` (pure) and `useClock` hook |
| `src/lib/dom.ts` | `isTypingTarget` |
| `src/lib/boot.ts` | `useBootSkip` |
| `src/components/TabBar.tsx` | tmux tab strip with certs and live clock |
| `src/components/Hero.tsx` | First viewport: session pane + nmap pane + rain |
| `src/components/MatrixRain.tsx` | Canvas glyph rain column |
| `src/components/StatusBar.tsx` | Fixed inverse status bar, hotkeys 1-4 |
| `src/components/Section.tsx` | Shared command-headed section |
| `src/components/sections/*.tsx` | Experience, Projects, Certs, Education, Leadership, Contact |
| `src/components/CommandPalette.tsx` | Ctrl+K / `/` terminal prompt on shadcn Command |
| `src/components/ui/*` | shadcn-generated, restyled |
| `src/index.css` | Tailwind import, terminal tokens, boot/cursor/scanline CSS |
| `scripts/ascii-name.mjs` | Writes `src/data/ascii-name.ts` via figlet |
| `scripts/redact-resume.py` | Copies resume PDF with phone numbers removed |
| `scripts/capture.mjs` | Playwright captures into `.impeccable/review/` |
| `scripts/readme/svg.ts` | Pure SVG and Markdown builders |
| `scripts/readme/font.ts` | Subsets and embeds Google Sans Code |
| `scripts/readme/generate.ts` | Writes `readme-out/README.md` and `readme-out/assets/*.svg` |
| `tests/phone.ts` | Shared phone-shaped pattern |
| `tests/no-phone.test.ts` | Fails if any phone-shaped string ships |
| `.github/workflows/deploy.yml` | Build, test, deploy to Pages |

---

### Task 1: Scaffold the project [SIMPLE]

**Files:**
- Create: Vite React TS scaffold files, `vite.config.ts`, `components.json`, `src/components/ui/{button,command,dialog,accordion}.tsx`
- Modify: `package.json`, `tsconfig.json`, `tsconfig.app.json`, `.gitignore`

**Interfaces:**
- Produces: `@/` alias to `src/`; `npm run dev|build|preview|test|capture|readme|ascii|redact`; shadcn components importable from `@/components/ui/*`.

- [ ] **Step 1: Scaffold Vite into the existing repo**

The repo already contains docs and `.impeccable/`; scaffold into a temp dir and move files in without overwriting.

```bash
cd /home/sonit/jasonsonith-portfolio
npm create vite@latest .scaffold -- --template react-ts
cp -rn .scaffold/. . && rm -rf .scaffold
rm -f src/App.css src/assets/react.svg public/vite.svg
npm install
```

Merge the scaffold's `.gitignore` entries with the existing file if `cp -n` skipped it.

- [ ] **Step 2: Install dependencies**

```bash
npm install tailwindcss @tailwindcss/vite @fontsource/google-sans-code
npm install -D @types/node vitest@5 playwright@1.63 figlet@1.11 subset-font@2.7 tsx
npx playwright install chromium
```

- [ ] **Step 3: Configure Vite, Vitest, and the alias**

`vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'tests/**/*.test.ts'] },
})
```

In both `tsconfig.json` and `tsconfig.app.json` add under `compilerOptions`:

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

In `tsconfig.app.json` set `"include": ["src", "scripts", "tests"]` and `"types": ["node", "vite/client"]`.

Replace `src/index.css` with a single line so shadcn init detects Tailwind:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Initialize shadcn and add components**

```bash
npx shadcn@latest init --help
```

Use the flags it lists to run a non-interactive init with the Radix base, base color `neutral`, CSS variables on. Then:

```bash
npx shadcn@latest add button command dialog accordion
```

Expected: `components.json`, `src/lib/utils.ts`, and the four files under `src/components/ui/` exist.

- [ ] **Step 5: Add scripts and ignore build outputs**

In `package.json` `scripts`:

```json
"dev": "vite",
"build": "tsc -b && vite build",
"preview": "vite preview --port 4173 --strictPort",
"test": "vitest run",
"ascii": "node scripts/ascii-name.mjs",
"capture": "node scripts/capture.mjs",
"readme": "tsx scripts/readme/generate.ts",
"redact": "python3 scripts/redact-resume.py"
```

Append to `.gitignore`:

```
readme-out/
.impeccable/review/
.impeccable/build/scaffold/
```

- [ ] **Step 6: Re-rank the face with a real browser**

Playwright is now resolvable, so the ranking can render candidates.

```bash
$I font-match --rank experience-table --text "Mobile Health Infirmary" --candidates "Google Sans Code:400,Azeret Mono:400,Spline Sans Mono:400,Roboto Mono:400"
```

Expected: a `USE` line. If it names a face other than Google Sans Code, stop and report to the user before continuing: Google Sans Code is the only tested face with the `█` block glyphs the ASCII name needs, and a swap touches `src/main.tsx` imports and `scripts/readme/font.ts`.

- [ ] **Step 7: Verify gates and commit**

```bash
npm run build && npm test -- --passWithNoTests
git add -A && git commit -m "chore: scaffold vite react shadcn project"
```

Expected: build succeeds; vitest reports no tests.

---

### Task 2: Profile data and the phone guard [SIMPLE]

**Files:**
- Create: `src/data/profile.ts`, `tests/phone.ts`, `tests/no-phone.test.ts`

**Interfaces:**
- Produces: `links`, `identity`, `experience: Experience[]`, `services: Service[]`, `projects: Project[]`, `certs: string[]`, `awards: string[]`, `education: Education[]`, `leadership: Leadership[]`, `skills: SkillGroup[]` and their types; `PHONE: RegExp` from `tests/phone.ts`.

- [ ] **Step 1: Write the phone guard test**

`tests/phone.ts`:

```ts
export const PHONE = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b/
```

`tests/no-phone.test.ts`:

```ts
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
      .filter((f) => !f.endsWith('no-phone.test.ts') && PHONE.test(readFileSync(f, 'utf8')))
    expect(hits).toEqual([])
  })
})
```

- [ ] **Step 2: Run it**

Run: `npx vitest run tests/no-phone.test.ts`
Expected: PASS. If `2026.05-2026.08` matches, tighten the pattern before continuing.

- [ ] **Step 3: Write the profile data**

`src/data/profile.ts`:

```ts
export const links = {
  email: 'mailto:JasonSonith1@gmail.com',
  emailText: 'JasonSonith1@gmail.com',
  github: 'https://github.com/JasonSonith',
  linkedin: 'https://www.linkedin.com/in/jason-sonith',
  site: 'https://jasonsonith.github.io',
  resume: '/resume.pdf',
  resumeAbsolute: 'https://jasonsonith.github.io/resume.pdf',
} as const

export const identity = {
  name: 'Jason Sonith',
  handle: 'jason@sonith',
  roles: ['Penetration Tester / Product Security', 'M.S. Information Security @ Georgia Tech'],
  certsShort: ['SEC+', 'CySA+', 'AWS CP'],
}

export type Experience = {
  periodShort: string
  period: string
  org: string
  orgShort: string
  role: string
  points: string[]
}

export const experience: Experience[] = [
  {
    periodShort: '2026.05-08',
    period: 'May-Aug 2026',
    org: 'Honeywell',
    orgShort: 'Honeywell',
    role: 'Product Security Assurance Intern',
    points: [
      'Tested firmware, web applications, and software for security vulnerabilities; assessed risk across product lines.',
      'Used Nmap, Burp Suite, OWASP ZAP, and Gobuster to enumerate services and test web applications.',
      'Documented findings and remediation recommendations for developers; validated fixes with product teams.',
    ],
  },
  {
    periodShort: '2025.02-26',
    period: 'Feb 2025-May 2026',
    org: 'Mobile Health Infirmary',
    orgShort: 'Mobile Health Infirmary',
    role: 'Cybersecurity Intern',
    points: [
      'Monitored network activity for vulnerabilities, supported system hardening, and resolved staff access issues.',
      'Developed and implemented a NIST-aligned incident response playbook defining severity levels, response roles, evidence handling, and recovery validation to support HIPAA/HITECH requirements.',
      'Supported migration of on-premises systems to AWS.',
    ],
  },
  {
    periodShort: '2025.07-26',
    period: 'Jul 2025-May 2026',
    org: 'University of South Alabama',
    orgShort: 'Univ. of South Alabama',
    role: 'Research Assistant',
    points: [
      'Built Python preprocessing scripts with ObsPy and pandas to extract metadata and normalize seismic recordings.',
      'Tuned a nonlinear phase space classifier across 16 graph features and 600,000 labeled waveforms.',
    ],
  },
]

export type Service = { port: string; service: string }

// Verbatim from the approved comp; Task 8 replaces these with the tools' real default ports.
export const services: Service[] = [
  { port: '443/tcp', service: 'burp-suite' },
  { port: '8080/tcp', service: 'owasp-zap' },
  { port: '22/tcp', service: 'metasploit' },
  { port: '9997/tcp', service: 'splunk' },
  { port: '53/tcp', service: 'aws-guardduty' },
]

export type Project = {
  slug: string
  name: string
  role?: string
  period?: string
  summary: string
  points: string[]
  stack: string[]
  repo?: string
}

export const projects: Project[] = [
  {
    slug: 'skills-assessment-platform',
    name: 'Engineering Skills Assessment Platform',
    role: 'Co-founder & Developer',
    period: '2026.07-now',
    summary: 'Browser-based CAD platform for practical engineering assessments.',
    points: [
      'Implemented token-authenticated session APIs and autosave recovery.',
      'Addressed path traversal, stale-write conflicts, and submission failure handling.',
    ],
    stack: ['TypeScript', 'WebAssembly', 'Python', 'FastAPI'],
  },
  {
    slug: 'oscp-labs',
    name: 'OSCP Penetration Testing Labs',
    role: 'HTB / CPTS',
    period: '2026.07-now',
    summary: 'Hands-on offensive practice while preparing for the OSCP.',
    points: [
      'Service enumeration, web exploitation, packet analysis, and Linux privilege escalation.',
      'Documented attack paths and findings for each target.',
    ],
    stack: ['Linux', 'Nmap', 'Burp Suite', 'Metasploit'],
    repo: 'https://github.com/JasonSonith/OSCP',
  },
  {
    slug: 'nextcloud-lab',
    name: 'Nextcloud Security Assessment Lab',
    period: '2025.08',
    summary: 'Docker lab with nginx, TLS, and MariaDB, attacked to assess a self-hosted Nextcloud.',
    points: [
      'Tested authentication, sessions, brute-force protection, and CSRF defenses.',
      'Documented findings and remediation for each issue.',
    ],
    stack: ['Docker', 'nginx', 'MariaDB', 'Burp Suite', 'OWASP ZAP', 'Nmap'],
    repo: 'https://github.com/JasonSonith/Team-7-nextcloud-security-lab',
  },
  {
    slug: 'medical-device-validation',
    name: 'Multi-Agent AI Medical Device Validation Platform',
    summary: 'Python pipeline that scrapes manufacturer sites and validates device data against the FDA GUDID database.',
    points: [
      'Secured with bcrypt hashing, role-based access control, and breached-password screening at signup.',
      'Cleared an OWASP ZAP scan: 58 checks, zero failures.',
    ],
    stack: ['Python', 'bcrypt', 'RBAC', 'OWASP ZAP'],
  },
  {
    slug: 'earthquake-prediction',
    name: 'Earthquake Prediction Research',
    period: '2025.07-2026.05',
    summary: 'Nonlinear phase space classification of seismic waveforms.',
    points: ['Preprocessing with ObsPy and pandas; classifier tuned across 16 graph features and 600,000 labeled waveforms.'],
    stack: ['Python', 'ObsPy', 'pandas'],
    repo: 'https://github.com/JasonSonith/Earthquake-prediction',
  },
  {
    slug: 'pfsense-lab',
    name: 'pfSense IDS/IPS Lab',
    summary: 'Small enterprise network simulation with Kali Linux as the attacker and pfSense providing IDS/IPS.',
    points: [],
    stack: ['pfSense', 'Kali Linux', 'Ubuntu'],
    repo: 'https://github.com/JasonSonith/pfsense-ids-ips-lab',
  },
  {
    slug: 'python-log-analyzer',
    name: 'python-log-analyzer',
    summary: 'Script that analyzes JSON logs and flags suspicious events.',
    points: [],
    stack: ['Python'],
    repo: 'https://github.com/JasonSonith/python-log-analyzer',
  },
]

export const certs = ['CompTIA Security+', 'CompTIA CySA+', 'AWS Cloud Practitioner']
export const awards = ['School of Computing Student of the Year, University of South Alabama (2025-2026)']

export type Education = { school: string; degree: string; period: string; detail?: string }
export const education: Education[] = [
  { school: 'Georgia Institute of Technology', degree: 'M.S. Information Security', period: 'Expected May 2028' },
  {
    school: 'University of South Alabama',
    degree: 'B.S. Computer Science, Cybersecurity Concentration',
    period: '2022-2026',
    detail: 'GPA 3.9, summa cum laude',
  },
]

export type Leadership = { title: string; org: string; period: string; point: string }
export const leadership: Leadership[] = [
  {
    title: 'Member',
    org: 'GreyHat',
    period: 'Aug 2026-now',
    point: 'Competed in TNC26 CTF, solving web vulnerability challenges by crafting payloads to escalate privileges and capture flags.',
  },
  {
    title: 'Student Government Senator',
    org: 'University of South Alabama',
    period: 'Mar 2025-May 2026',
    point: 'Started a School of Computing hackathon and passed legislation securing $6,000 for computing events.',
  },
  {
    title: 'President, Video Game Development Club',
    org: 'University of South Alabama',
    period: 'Fall 2024-May 2026',
    point: 'Revived an inactive club and rebuilt member engagement.',
  },
]

export type SkillGroup = { label: string; items: string[] }
export const skills: SkillGroup[] = [
  { label: 'security', items: ['Burp Suite', 'Nmap', 'OWASP ZAP', 'Metasploit', 'Gobuster', 'Splunk', 'Nessus', 'pfSense', 'WireGuard', 'Kali Linux'] },
  { label: 'cloud', items: ['AWS IAM', 'EC2', 'S3', 'GuardDuty', 'CloudTrail', 'Config', 'Linux', 'Docker'] },
  { label: 'languages', items: ['Python', 'PowerShell', 'Bash', 'Java', 'JavaScript', 'C'] },
]
```

- [ ] **Step 4: Run guard and typecheck, commit**

```bash
npx vitest run tests/no-phone.test.ts && npx tsc -b
git add src/data/profile.ts tests && git commit -m "feat: add profile data and phone guard"
```

Expected: PASS, no type errors.

---

### Task 3: Redacted resume copy [MODERATE]

**Files:**
- Create: `scripts/redact-resume.py`, `public/resume.pdf` (generated)

**Interfaces:**
- Produces: `public/resume.pdf` served at `/resume.pdf`.

- [ ] **Step 1: Write the script with a built-in verification**

`scripts/redact-resume.py`:

```python
#!/usr/bin/env python3
"""Copy a resume PDF with every phone number (and its leading separator) removed.

Usage: redact-resume.py <input.pdf> <output.pdf>
"""
import re
import sys

import pymupdf

PHONE = re.compile(r"(?:\|\s*)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b")


def redact(src: str, dst: str) -> int:
    doc = pymupdf.open(src)
    hits = 0
    for page in doc:
        for match in PHONE.finditer(page.get_text()):
            for rect in page.search_for(match.group(0).strip()):
                page.add_redact_annot(rect, fill=(1, 1, 1))
                hits += 1
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE)
    doc.set_metadata({})
    doc.save(dst, garbage=4, deflate=True)
    doc.close()
    return hits


def leftovers(path: str) -> int:
    with pymupdf.open(path) as doc:
        return sum(len(PHONE.findall(page.get_text())) for page in doc)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    hits = redact(sys.argv[1], sys.argv[2])
    left = leftovers(sys.argv[2])
    if hits == 0 or left:
        sys.exit(f"redaction failed: hits={hits} leftover={left}")
    print(f"redacted {hits} phone occurrence(s) -> {sys.argv[2]}")
```

- [ ] **Step 2: Run it (the script exits non-zero on failure)**

```bash
mkdir -p public
npm run redact -- "/mnt/c/Users/sonit/OneDrive/Personal Documents/Resume.pdf" public/resume.pdf
```

Expected: `redacted 1 phone occurrence(s) -> public/resume.pdf`.

- [ ] **Step 3: Visually confirm the header line**

```bash
python3 -c "import pymupdf; pymupdf.open('public/resume.pdf')[0].get_pixmap(dpi=110).save('/tmp/claude-1000/-home-sonit/20a5c647-28e8-4de1-8901-06850fd802f6/scratchpad/resume-p1.png')"
```

Open the PNG: the email, GitHub, and LinkedIn text reads cleanly and no number group remains.

- [ ] **Step 4: Commit**

```bash
git add scripts/redact-resume.py public/resume.pdf && git commit -m "feat: add phone-redacted resume copy"
```

---

### Task 4: Command registry [MODERATE]

**Files:**
- Create: `src/lib/commands.ts`, `src/lib/commands.test.ts`, `src/lib/perform.ts`, `src/lib/dom.ts`, `src/lib/clock.ts`, `src/lib/clock.test.ts`

**Interfaces:**
- Consumes: `links` from `@/data/profile`.
- Produces: `SECTION_IDS`, `type SectionId = 'top' | 'experience' | 'projects' | 'certs' | 'education' | 'leadership' | 'contact'`; `type CommandAction`; `type TerminalCommand = { name: string; aliases: string[]; description: string; action: CommandAction }`; `COMMANDS: TerminalCommand[]`; `resolveCommand(input: string): TerminalCommand | undefined`; `perform(action: CommandAction): void`; `isTypingTarget(target: EventTarget | null): boolean`; `formatClock(d: Date): string`; `useClock(): Date`.

- [ ] **Step 1: Write failing tests**

`src/lib/commands.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { COMMANDS, SECTION_IDS, resolveCommand } from './commands'

describe('resolveCommand', () => {
  it('resolves by name', () => {
    expect(resolveCommand('projects')?.name).toBe('projects')
  })

  it('resolves aliases, case and prompt insensitive', () => {
    expect(resolveCommand('  $ LS ~/projects ')?.name).toBe('projects')
    expect(resolveCommand('./contact.sh')?.name).toBe('contact')
    expect(resolveCommand('clear')?.name).toBe('whoami')
  })

  it('returns undefined for unknown or empty input', () => {
    expect(resolveCommand('rm -rf /')).toBeUndefined()
    expect(resolveCommand('   ')).toBeUndefined()
  })

  it('every scroll target is a real section and names are unique', () => {
    const names = COMMANDS.flatMap((c) => [c.name, ...c.aliases])
    expect(new Set(names).size).toBe(names.length)
    for (const c of COMMANDS) {
      if (c.action.kind === 'scroll') expect(SECTION_IDS).toContain(c.action.target)
    }
  })
})
```

`src/lib/clock.test.ts`:

```ts
import { expect, it } from 'vitest'
import { formatClock } from './clock'

it('formats a local timestamp like a tmux status clock', () => {
  expect(formatClock(new Date(2026, 8, 3, 7, 5, 9))).toBe('2026-09-03 07:05:09')
})
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run src/lib`
Expected: FAIL, cannot resolve `./commands` and `./clock`.

- [ ] **Step 3: Implement**

`src/lib/commands.ts`:

```ts
import { links } from '@/data/profile'

export const SECTION_IDS = ['top', 'experience', 'projects', 'certs', 'education', 'leadership', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export type CommandAction =
  | { kind: 'scroll'; target: SectionId }
  | { kind: 'open'; href: string }
  | { kind: 'help' }

export type TerminalCommand = { name: string; aliases: string[]; description: string; action: CommandAction }

export const COMMANDS: TerminalCommand[] = [
  { name: 'whoami', aliases: ['clear', 'home'], description: 'back to the top', action: { kind: 'scroll', target: 'top' } },
  { name: 'experience', aliases: ['cat experience.log'], description: 'work history', action: { kind: 'scroll', target: 'experience' } },
  { name: 'projects', aliases: ['ls', 'ls ~/projects'], description: 'list projects', action: { kind: 'scroll', target: 'projects' } },
  { name: 'certs', aliases: ['cat certs.txt', 'skills'], description: 'certifications and skills', action: { kind: 'scroll', target: 'certs' } },
  { name: 'education', aliases: ['cat education.txt'], description: 'degrees', action: { kind: 'scroll', target: 'education' } },
  { name: 'leadership', aliases: ['history'], description: 'leadership and CTF', action: { kind: 'scroll', target: 'leadership' } },
  { name: 'contact', aliases: ['./contact.sh', 'email'], description: 'get in touch', action: { kind: 'scroll', target: 'contact' } },
  { name: 'resume', aliases: ['resume.pdf', 'cv'], description: 'open resume.pdf', action: { kind: 'open', href: links.resume } },
  { name: 'github', aliases: [], description: 'open GitHub', action: { kind: 'open', href: links.github } },
  { name: 'linkedin', aliases: [], description: 'open LinkedIn', action: { kind: 'open', href: links.linkedin } },
  { name: 'help', aliases: ['?', 'man'], description: 'list commands', action: { kind: 'help' } },
]

export function resolveCommand(input: string): TerminalCommand | undefined {
  const q = input.trim().replace(/^\$\s*/, '').toLowerCase()
  if (!q) return undefined
  return COMMANDS.find((c) => c.name === q || c.aliases.includes(q))
}
```

`src/lib/perform.ts`:

```ts
import type { CommandAction } from './commands'

export function perform(action: CommandAction) {
  if (action.kind === 'scroll') {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(action.target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  } else if (action.kind === 'open') {
    window.open(action.href, '_blank', 'noopener,noreferrer')
  }
}
```

`src/lib/dom.ts`:

```ts
export function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
}
```

`src/lib/clock.ts`:

```ts
import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

export function formatClock(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib && npx tsc -b`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib && git commit -m "feat: add terminal command registry and clock"
```

---

### Task 5: Hero first viewport, comp-led [COMPLEX]

**Files:**
- Create: `scripts/ascii-name.mjs`, `src/data/ascii-name.ts`, `src/components/TabBar.tsx`, `src/components/Hero.tsx`, `src/components/StatusBar.tsx`, `scripts/capture.mjs`
- Modify: `src/index.css`, `src/main.tsx`, `src/App.tsx`, `index.html`

**Interfaces:**
- Consumes: `identity`, `experience`, `services`, `links` from `@/data/profile`; `useClock`, `formatClock` from `@/lib/clock`; `isTypingTarget` from `@/lib/dom`.
- Produces: `<Hero />` (renders `id="top"`), `<StatusBar />`, `ASCII_NAME: string`, `ASCII_NAME_STACKED: string`, Tailwind colors `term`, `term-dim`, `term-faint`, `term-bg`; `.boot` (uses `--i`), `.cursor`, `.ascii`.

- [ ] **Step 1: Generate the ASCII name**

`scripts/ascii-name.mjs`:

```js
import figlet from 'figlet'
import { writeFileSync } from 'node:fs'

const art = (text) =>
  figlet
    .textSync(text, { font: 'ANSI Regular' })
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim())
    .join('\n')

const one = art('JASON SONITH')
const stacked = `${art('JASON')}\n\n${art('SONITH')}`

writeFileSync(
  'src/data/ascii-name.ts',
  `// Generated by scripts/ascii-name.mjs (figlet "ANSI Regular"). Do not edit.\nexport const ASCII_NAME = ${JSON.stringify(one)}\nexport const ASCII_NAME_STACKED = ${JSON.stringify(stacked)}\n`,
)
console.log(one)
```

Run: `npm run ascii`
Expected: 5 rows of block letters, 94 columns wide.

- [ ] **Step 2: Scaffold the measured layout**

```bash
$I build-phase scaffold
$I comp-spec --print
```

Expected: `.impeccable/build/scaffold/layout.css` and `hero-reference.html`. These percentages are what the gate scores.

- [ ] **Step 3: Terminal tokens and base CSS**

Rewrite `src/index.css` to the following, keeping any `@import "tw-animate-css";` and `@custom-variant` lines shadcn added directly under the Tailwind import:

```css
@import "tailwindcss";

:root {
  --term-bg: #080808;
  --term-fg: #08f679;
  --term-dim: #089d46;
  --term-faint: #083211;
  --background: var(--term-bg);
  --foreground: var(--term-fg);
  --card: var(--term-bg);
  --card-foreground: var(--term-fg);
  --popover: #0b100c;
  --popover-foreground: var(--term-fg);
  --primary: var(--term-fg);
  --primary-foreground: var(--term-bg);
  --secondary: var(--term-faint);
  --secondary-foreground: var(--term-fg);
  --muted: var(--term-faint);
  --muted-foreground: var(--term-dim);
  --accent: var(--term-faint);
  --accent-foreground: var(--term-fg);
  --destructive: var(--term-fg);
  --border: var(--term-dim);
  --input: var(--term-dim);
  --ring: var(--term-fg);
  --radius: 0rem;
  --statusbar-h: clamp(36px, 4.7vh, 48px);
  color-scheme: dark;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-term: var(--term-fg);
  --color-term-dim: var(--term-dim);
  --color-term-faint: var(--term-faint);
  --color-term-bg: var(--term-bg);
  --radius-sm: 0rem;
  --radius-md: 0rem;
  --radius-lg: 0rem;
  --radius-xl: 0rem;
  --font-mono: "Google Sans Code", ui-monospace, monospace;
}

@layer base {
  html {
    background: var(--term-bg);
    color: var(--term-fg);
    font-family: var(--font-mono);
    font-size: clamp(14px, 1.49vw, 22px);
    line-height: 1.47;
    font-variant-ligatures: none;
  }
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 60;
    background: repeating-linear-gradient(to bottom, transparent 0 2px, rgb(0 0 0 / 0.22) 2px 3px);
  }
  ::selection { background: var(--term-fg); color: var(--term-bg); }
  :focus-visible { outline: 2px solid var(--term-fg); outline-offset: 2px; }
  a { text-decoration: underline; text-decoration-color: var(--term-dim); text-underline-offset: 3px; }
  a:hover { background: var(--term-fg); color: var(--term-bg); text-decoration: none; }
}

.ascii {
  font-size: calc(56.6vw / (94 * 0.6));
  line-height: 1.42;
  white-space: pre;
}

.boot { animation: boot-in 0.32s steps(20, end) both; animation-delay: calc(var(--i, 0) * 140ms); }
@keyframes boot-in { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
.cursor { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
html[data-boot="done"] .boot { animation: none; }

@media (prefers-reduced-motion: reduce) {
  .boot, .cursor { animation: none; }
}
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/google-sans-code/400.css'
import '@fontsource/google-sans-code/700.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

In `index.html`: `<html lang="en">`, `<title>Jason Sonith | Penetration Tester</title>`, `<meta name="description" content="Jason Sonith: penetration tester and product security, M.S. Information Security at Georgia Tech." />`, `<meta name="theme-color" content="#080808" />`, and remove the Vite favicon link.

- [ ] **Step 4: Tab bar, hero panes, status bar**

`src/components/TabBar.tsx`:

```tsx
import { identity } from '@/data/profile'
import { formatClock, useClock } from '@/lib/clock'

export function TabBar() {
  const now = useClock()
  return (
    <div className="mx-[0.6vw] mt-[1.1vh] grid h-[4.4vh] min-h-9 grid-cols-3 items-center border border-term px-[1.1vw]">
      <span>[0]&nbsp;&nbsp;{identity.handle}: ~</span>
      <span className="justify-self-center">{identity.certsShort.join(' | ')}</span>
      <time className="justify-self-end tabular-nums" dateTime={now.toISOString()}>
        {formatClock(now)}
      </time>
    </div>
  )
}
```

`src/components/Hero.tsx`:

```tsx
import type { CSSProperties } from 'react'
import { ASCII_NAME, ASCII_NAME_STACKED } from '@/data/ascii-name'
import { experience, identity, services } from '@/data/profile'
import { TabBar } from './TabBar'

const PROMPT = `${identity.handle}:~$`
const step = (i: number) => ({ '--i': i }) as CSSProperties

function Prompt({ cmd, i }: { cmd: string; i: number }) {
  return (
    <p className="boot" style={step(i)}>
      {PROMPT} {cmd}
    </p>
  )
}

function SessionPane() {
  return (
    <section aria-label="Session" className="pl-[1.75vw] pt-[1.2vh]">
      <Prompt cmd="whoami" i={0} />
      <h1 className="sr-only">{identity.name}</h1>
      <pre aria-hidden="true" className="ascii boot mt-[1.6vh] max-md:hidden" style={step(1)}>
        {ASCII_NAME}
      </pre>
      <pre aria-hidden="true" className="boot mt-3 hidden text-[2.1vw] leading-[1.42] max-md:block" style={step(1)}>
        {ASCII_NAME_STACKED}
      </pre>
      <div className="boot mt-[2.4vh]" style={step(2)}>
        {identity.roles.map((r) => (
          <p key={r}>{r}</p>
        ))}
      </div>
      <div className="mt-[3.1vh]">
        <Prompt cmd="cat experience.log" i={3} />
      </div>
      <table className="boot mt-[1.9vh] border-collapse" style={step(4)}>
        <caption className="sr-only">Experience</caption>
        <colgroup>
          <col className="w-[12.55vw]" />
          <col className="w-[20.1vw]" />
          <col />
        </colgroup>
        <tbody>
          {experience.map((e) => (
            <tr key={e.org}>
              <td className="p-0 tabular-nums">{e.periodShort}</td>
              <td className="p-0">{e.orgShort}</td>
              <td className="p-0">{e.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="boot mt-[3.1vh]" style={step(5)}>
        {PROMPT} <span aria-hidden="true" className="cursor inline-block h-[1.1em] w-[0.6em] translate-y-[0.15em] bg-term" />
      </p>
    </section>
  )
}

function NmapPane() {
  return (
    <section
      aria-labelledby="nmap-title"
      className="border-l border-term pl-[1.9vw] pt-[0.9vh] max-md:border-l-0 max-md:border-t max-md:pl-[1.75vw] max-md:pt-4"
    >
      <p id="nmap-title" className="boot" style={step(1)}>
        nmap -sV jason
      </p>
      <table className="boot mt-[2.1vh] border-collapse" style={step(2)}>
        <caption className="sr-only">Tools shown as open services</caption>
        <colgroup>
          <col className="w-[9.4vw]" />
          <col className="w-[7.5vw]" />
          <col />
        </colgroup>
        <thead>
          <tr className="text-left">
            <th className="p-0 font-normal">PORT</th>
            <th className="p-0 font-normal">STATE</th>
            <th className="p-0 font-normal">SERVICE</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.service}>
              <td className="p-0">{s.port}</td>
              <td className="p-0">open</td>
              <td className="p-0">{s.service}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function Hero() {
  return (
    <header id="top" className="relative flex min-h-[600px] flex-col pb-[calc(var(--statusbar-h)+3.4vh)] md:h-svh">
      <TabBar />
      <div className="grid flex-1 grid-cols-[62fr_38fr] max-md:grid-cols-1">
        <SessionPane />
        <NmapPane />
      </div>
    </header>
  )
}
```

`src/components/StatusBar.tsx`:

```tsx
import { useEffect } from 'react'
import { links } from '@/data/profile'
import { isTypingTarget } from '@/lib/dom'

const ITEMS = [
  { key: '1', label: 'contact', href: '#contact', external: false },
  { key: '2', label: 'resume.pdf', href: links.resume, external: true },
  { key: '3', label: 'github', href: links.github, external: true },
  { key: '4', label: 'linkedin', href: links.linkedin, external: true },
]

export function StatusBar() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return
      document.querySelector<HTMLAnchorElement>(`[data-hotkey="${e.key}"]`)?.click()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-[0.6vw] bottom-[2.2vh] z-40 grid h-[var(--statusbar-h)] grid-cols-4 items-center bg-term px-[1.1vw] text-term-bg"
    >
      {ITEMS.map((item) => (
        <a
          key={item.key}
          data-hotkey={item.key}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
          className="justify-self-center no-underline first:justify-self-start hover:bg-term-bg hover:text-term"
        >
          [{item.key}]&nbsp;&nbsp;{item.label}
        </a>
      ))}
    </nav>
  )
}
```

`src/App.tsx`:

```tsx
import { Hero } from '@/components/Hero'
import { StatusBar } from '@/components/StatusBar'

export default function App() {
  return (
    <>
      <Hero />
      <StatusBar />
    </>
  )
}
```

- [ ] **Step 5: Capture script**

`scripts/capture.mjs`:

```js
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
  await shot('desktop', { width: 1440, height: 900 }, { fullPage: true })
  await shot('mobile', { width: 390, height: 844 }, { fullPage: true })
  await shot('user-1280', { width: 1280, height: 800 })
}
await browser.close()
```

- [ ] **Step 6: Build, serve, capture, record the hero**

```bash
npm run build
npm run preview   # run in background; wait until it prints the local URL
npm run capture -- hero
$I build-phase record hero --build .impeccable/review/hero-repro.png
```

Expected: a region table. Open `.impeccable/review/hero-repro.png` beside the comp.

- [ ] **Step 7: Hero gate loop**

```bash
$I build-phase advance
```

On failure, open the region crops it lists in `.impeccable/review/diff/hero/` in order. `missing` needs its element; `contradicted` needs structure re-derived from the spec box; `drift` means adjusting the vw/vh values in `Hero.tsx`, `TabBar.tsx`, `StatusBar.tsx`, or `.ascii` in `index.css` by the numbers the gate prints (for "cap height 78px in the build, 103px in the comp", scale that region's font-size by 103/78). Rebuild, re-capture, advance. Never nudge the same region a third time without re-deriving it from its spec box. Continue until `ADVANCED hero -> sections`. The live clock text differs from the comp's frozen timestamp by design; if the gate vetoes only that region as contradicted, note it and pass `--force --reason` only with the user's words, otherwise ask the user.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: build terminal hero viewport against approved comp"
```

---

### Task 6: Sections below the fold [MODERATE]

**Files:**
- Create: `src/components/Section.tsx`, `src/components/sections/{Experience,Projects,Certs,Education,Leadership,Contact}.tsx`
- Modify: `src/components/ui/accordion.tsx`, `src/components/ui/button.tsx`, `src/App.tsx`

**Interfaces:**
- Consumes: `SectionId` from `@/lib/commands`; data exports from `@/data/profile`; shadcn `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `Button`.
- Produces: sections with ids `experience`, `projects`, `certs`, `education`, `leadership`, `contact`.

- [ ] **Step 1: Shared section**

`src/components/Section.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { SectionId } from '@/lib/commands'

export function Section({ id, command, title, children }: { id: SectionId; command: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 pt-[3lh]">
      <h2 id={`${id}-title`} className="font-normal">
        <span aria-hidden="true">
          <span className="text-term-dim">jason@sonith:~$ </span>
          {command}
        </span>
        <span className="sr-only">{title}</span>
      </h2>
      <div className="mt-[1lh]">{children}</div>
    </section>
  )
}
```

- [ ] **Step 2: Restyle shadcn primitives into the terminal vocabulary**

In `src/components/ui/accordion.tsx`, inside `AccordionTrigger`, replace the `ChevronDownIcon` element (and remove its import) with:

```tsx
<span aria-hidden="true" className="shrink-0 text-term-dim group-data-[state=open]/trigger:hidden">[+]</span>
<span aria-hidden="true" className="hidden shrink-0 group-data-[state=open]/trigger:inline">[-]</span>
```

Add `group/trigger` and `hover:bg-term-faint` to the trigger's `className`; remove `rounded-md`, `hover:underline`, and `[&[data-state=open]>svg]:rotate-180`.

In `src/components/ui/button.tsx`, set the `default` variant to `"bg-term text-term-bg border border-term hover:bg-term-bg hover:text-term"`, the `outline` variant to `"border border-term bg-transparent text-term hover:bg-term hover:text-term-bg"`, and remove every `rounded-*` class from the base string.

- [ ] **Step 3: Section components**

`src/components/sections/Experience.tsx`:

```tsx
import { experience } from '@/data/profile'
import { Section } from '../Section'

export function Experience() {
  return (
    <Section id="experience" command="cat experience.log --verbose" title="Experience">
      <ol className="grid gap-[1.5lh]">
        {experience.map((e) => (
          <li key={e.org}>
            <p>
              <span className="text-term-dim tabular-nums">[{e.period}]</span> {e.org} :: {e.role}
            </p>
            <ul className="mt-[0.5lh] grid gap-[0.25lh] pl-[2ch]">
              {e.points.map((pt) => (
                <li key={pt} className="relative pl-[2ch] before:absolute before:left-0 before:text-term-dim before:content-['>']">
                  {pt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
```

`src/components/sections/Projects.tsx`:

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { projects } from '@/data/profile'
import { Section } from '../Section'

export function Projects() {
  return (
    <Section id="projects" command="ls -la ~/projects" title="Projects">
      <p className="text-term-dim">total {projects.length}</p>
      <Accordion type="multiple" className="border-t border-term-faint">
        {projects.map((p) => (
          <AccordionItem key={p.slug} value={p.slug} className="border-term-faint">
            <AccordionTrigger className="py-[0.4lh] text-base">
              <span className="grid w-full grid-cols-[11ch_16ch_1fr] gap-x-[2ch] text-left max-md:grid-cols-1">
                <span className="text-term-dim max-md:hidden">drwxr-xr-x</span>
                <span className="text-term-dim tabular-nums">{p.period ?? '-'}</span>
                <span>
                  {p.name}/{p.role && <span className="text-term-dim"> ({p.role})</span>}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-[29ch] text-base max-md:pl-0">
              <p>{p.summary}</p>
              {p.points.length > 0 && (
                <ul className="mt-[0.5lh] grid gap-[0.25lh]">
                  {p.points.map((pt) => (
                    <li key={pt} className="relative pl-[2ch] before:absolute before:left-0 before:text-term-dim before:content-['>']">
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-[0.5lh] text-term-dim">stack: {p.stack.join(', ')}</p>
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="mt-[0.5lh] inline-block">
                  git clone {p.repo.replace('https://', '')}
                </a>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
```

`src/components/sections/Certs.tsx`:

```tsx
import { awards, certs, skills } from '@/data/profile'
import { Section } from '../Section'

export function Certs() {
  return (
    <Section id="certs" command="cat certs.txt skills.txt" title="Certifications and skills">
      <ul className="grid gap-[0.25lh]">
        {[...certs, ...awards].map((c) => (
          <li key={c}>
            <span className="text-term-dim">[verified]</span> {c}
          </li>
        ))}
      </ul>
      <dl className="mt-[1lh] grid grid-cols-[12ch_1fr] gap-y-[0.25lh] max-md:grid-cols-1">
        {skills.map((g) => (
          <div key={g.label} className="contents">
            <dt className="text-term-dim">{g.label}:</dt>
            <dd>{g.items.join('  ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
```

`src/components/sections/Education.tsx`:

```tsx
import { education } from '@/data/profile'
import { Section } from '../Section'

export function Education() {
  return (
    <Section id="education" command="cat education.txt" title="Education">
      <ul className="grid gap-[1lh]">
        {education.map((e) => (
          <li key={e.school}>
            <p>
              {e.school} <span className="text-term-dim">[{e.period}]</span>
            </p>
            <p className="pl-[2ch]">{e.degree}</p>
            {e.detail && <p className="pl-[2ch] text-term-dim">{e.detail}</p>}
          </li>
        ))}
      </ul>
    </Section>
  )
}
```

`src/components/sections/Leadership.tsx`:

```tsx
import { leadership } from '@/data/profile'
import { Section } from '../Section'

export function Leadership() {
  return (
    <Section id="leadership" command="history | grep leadership" title="Leadership and CTF">
      <ol className="grid gap-[1lh]">
        {leadership.map((l, i) => (
          <li key={l.title} className="grid grid-cols-[5ch_1fr]">
            <span className="text-term-dim tabular-nums">{String(i + 1).padStart(3, ' ')}</span>
            <span>
              {l.title}, {l.org} <span className="text-term-dim">[{l.period}]</span>
              <span className="block text-term-dim">{l.point}</span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
```

`src/components/sections/Contact.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { links } from '@/data/profile'
import { Section } from '../Section'

const ROWS = [
  { label: 'email', href: links.email, text: links.emailText, external: false },
  { label: 'linkedin', href: links.linkedin, text: links.linkedin.replace('https://www.', ''), external: true },
  { label: 'github', href: links.github, text: links.github.replace('https://', ''), external: true },
]

export function Contact() {
  return (
    <Section id="contact" command="./contact.sh" title="Contact">
      <p className="text-term-dim">[*] opening channel to jason@sonith ...</p>
      <dl className="mt-[1lh] grid grid-cols-[10ch_1fr] gap-y-[0.25lh]">
        {ROWS.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-term-dim">{r.label}</dt>
            <dd>
              <a href={r.href} target={r.external ? '_blank' : undefined} rel={r.external ? 'noreferrer' : undefined}>
                {r.text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-[1.5lh] flex flex-wrap gap-[2ch]">
        <Button asChild>
          <a href={links.email} className="no-underline">
            [ send email ]
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={links.resume} target="_blank" rel="noreferrer" className="no-underline">
            [ resume.pdf ]
          </a>
        </Button>
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Mount sections**

`src/App.tsx`:

```tsx
import { Hero } from '@/components/Hero'
import { StatusBar } from '@/components/StatusBar'
import { Certs } from '@/components/sections/Certs'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Leadership } from '@/components/sections/Leadership'
import { Projects } from '@/components/sections/Projects'

export default function App() {
  return (
    <>
      <Hero />
      <main className="mx-auto max-w-[110ch] px-[1.75vw] pb-[calc(var(--statusbar-h)+6lh)] max-md:px-4">
        <Experience />
        <Projects />
        <Certs />
        <Education />
        <Leadership />
        <Contact />
      </main>
      <StatusBar />
    </>
  )
}
```

- [ ] **Step 5: Verify and advance**

```bash
npm run build && npm test
npm run capture -- responsive
$I build-phase advance
```

Open `.impeccable/review/desktop.png`: sections share the hero's grammar (prompt headers, dim labels, no rounded or boxed cards). Expected: `ADVANCED sections -> motion`; fix and repeat on failure.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add command-headed resume sections"
```

---

### Task 7: Motion and interaction [MODERATE]

**Files:**
- Create: `src/components/MatrixRain.tsx`, `src/components/CommandPalette.tsx`, `src/lib/boot.ts`, `scripts/smoke.mjs`
- Modify: `src/components/Hero.tsx`, `src/components/TabBar.tsx`, `src/App.tsx`, `src/components/ui/command.tsx`

**Interfaces:**
- Consumes: `COMMANDS`, `resolveCommand`, `TerminalCommand` from `@/lib/commands`; `perform` from `@/lib/perform`; `isTypingTarget` from `@/lib/dom`; shadcn `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`.
- Produces: `<MatrixRain className />`, `<CommandPalette />`, `useBootSkip(): void`.

- [ ] **Step 1: Boot skip**

`src/lib/boot.ts`:

```ts
import { useEffect } from 'react'

export function useBootSkip() {
  useEffect(() => {
    const done = () => {
      document.documentElement.dataset.boot = 'done'
      window.removeEventListener('keydown', done)
      window.removeEventListener('pointerdown', done)
    }
    window.addEventListener('keydown', done)
    window.addEventListener('pointerdown', done)
    return () => {
      window.removeEventListener('keydown', done)
      window.removeEventListener('pointerdown', done)
    }
  }, [])
}
```

- [ ] **Step 2: Matrix rain column**

`src/components/MatrixRain.tsx`:

```tsx
import { useEffect, useRef } from 'react'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789abcdef#$%&*+=<>'
const CELL = 14

export function MatrixRain({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let drops: number[] = []
    let visible = true
    let raf = 0
    let last = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      ;({ width: w, height: h } = canvas.getBoundingClientRect())
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${CELL - 2}px "Google Sans Code", monospace`
      drops = Array.from({ length: Math.max(1, Math.floor(w / CELL)) }, () => Math.floor(Math.random() * (h / CELL)))
    }

    const step = () => {
      ctx.fillStyle = 'rgb(8 8 8 / 0.2)'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#08f679'
      drops.forEach((row, col) => {
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], col * CELL, row * CELL)
        drops[col] = row * CELL > h && Math.random() > 0.96 ? 0 : row + 1
      })
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden || t - last < 70) return
      last = t
      step()
    }

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) for (let i = 0; i < 60; i++) step()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)
    if (!reduce) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
```

In `Hero.tsx`, import `MatrixRain` and render it as the last child of `<header>`:

```tsx
<MatrixRain className="pointer-events-none absolute bottom-[7%] right-[0.6%] top-[6.6%] w-[3.8%] max-md:hidden" />
```

- [ ] **Step 3: Command palette**

`src/components/CommandPalette.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { COMMANDS, resolveCommand, type TerminalCommand } from '@/lib/commands'
import { isTypingTarget } from '@/lib/dom'
import { perform } from '@/lib/perform'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)
      const slash = e.key === '/' && !isTypingTarget(e.target)
      if (!combo && !slash) return
      e.preventDefault()
      setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const run = (cmd: TerminalCommand) => {
    setQuery('')
    if (cmd.action.kind === 'help') return
    setOpen(false)
    perform(cmd.action)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Terminal" description="Type a command, or help">
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="type a command, or help"
        onKeyDown={(e) => {
          const exact = resolveCommand(query)
          if (e.key === 'Enter' && exact) {
            e.preventDefault()
            run(exact)
          }
        }}
      />
      <CommandList>
        <CommandEmpty>command not found: {query.trim()} (try help)</CommandEmpty>
        <CommandGroup heading="commands">
          {COMMANDS.map((c) => (
            <CommandItem key={c.name} value={[c.name, ...c.aliases].join(' ')} onSelect={() => run(c)}>
              <span>{c.name}</span>
              <span className="ml-auto text-term-dim">{c.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

Update `App` to call `useBootSkip()` at its top and render `<CommandPalette />` after `<StatusBar />`:

```tsx
import { CommandPalette } from '@/components/CommandPalette'
import { Hero } from '@/components/Hero'
import { StatusBar } from '@/components/StatusBar'
import { Certs } from '@/components/sections/Certs'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Leadership } from '@/components/sections/Leadership'
import { Projects } from '@/components/sections/Projects'
import { useBootSkip } from '@/lib/boot'

export default function App() {
  useBootSkip()
  return (
    <>
      <Hero />
      <main className="mx-auto max-w-[110ch] px-[1.75vw] pb-[calc(var(--statusbar-h)+6lh)] max-md:px-4">
        <Experience />
        <Projects />
        <Certs />
        <Education />
        <Leadership />
        <Contact />
      </main>
      <StatusBar />
      <CommandPalette />
    </>
  )
}
```

Make the palette discoverable in `TabBar.tsx` by changing the first `<span>` to:

```tsx
<span>
  [0]&nbsp;&nbsp;{identity.handle}: ~ <kbd className="text-term-dim max-lg:hidden">ctrl+k</kbd>
</span>
```

In `src/components/ui/command.tsx`: remove `rounded-*` classes, set `CommandItem`'s selected style to `data-[selected=true]:bg-term data-[selected=true]:text-term-bg`, and add `border border-term bg-popover` to the `DialogContent` inside `CommandDialog`.

- [ ] **Step 4: Smoke test the interactions**

`scripts/smoke.mjs`:

```js
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

const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('3')])
if (!popup.url().startsWith('https://github.com/JasonSonith')) fail(`hotkey 3 opened ${popup.url()}`)

await browser.close()
if (!process.exitCode) console.log('smoke ok')
```

Run:

```bash
npm run build && npm test
npm run preview   # background, if not already running
node scripts/smoke.mjs
$I build-phase advance
```

Expected: `smoke ok` and `ADVANCED motion -> responsive`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add boot sequence, matrix rain, and command palette"
```

---

### Task 8: Responsive pass and stated content rewrite [MODERATE]

**Files:**
- Modify: `src/data/profile.ts`, component classes as captures require

- [ ] **Step 1: Apply the stated rewrite**

The hero passed with comp words. Security readers will notice mismatched ports, so show each tool on the port it really listens on by default. In `src/data/profile.ts` replace `services` and its comment with:

```ts
// Tools shown on the default ports they listen on.
export const services: Service[] = [
  { port: '8080/tcp', service: 'burp-suite' },
  { port: '4444/tcp', service: 'metasploit' },
  { port: '8834/tcp', service: 'nessus' },
  { port: '8000/tcp', service: 'splunk' },
  { port: '443/tcp', service: 'aws-guardduty' },
]
```

- [ ] **Step 2: Capture all viewports**

```bash
npm run build && npm run capture -- responsive
```

Open `desktop.png`, `mobile.png`, `user-1280.png`. Check: no horizontal scroll at 390; ASCII switches to the stacked variant; panes stack; status bar labels fit (below 480px, render `[1] contact [2] cv [3] gh [4] in` using a `max-[480px]:hidden` long label and a `hidden max-[480px]:inline` short label if they overflow); the hero keeps its composition at 1280 and 1440.

- [ ] **Step 3: Fix, re-capture once, advance**

```bash
npm run build && npm run capture -- responsive
$I build-phase advance
```

Expected: `ADVANCED responsive -> review`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: responsive layout and accurate tool ports"
```

---

### Task 9: GitHub profile README generator [COMPLEX]

**Files:**
- Create: `scripts/readme/svg.ts`, `scripts/readme/svg.test.ts`, `scripts/readme/font.ts`, `scripts/readme/generate.ts`, `scripts/readme-preview.mjs`

**Interfaces:**
- Consumes: data exports from `../../src/data/profile`; `ASCII_NAME` from `../../src/data/ascii-name`; `PHONE` from `../../tests/phone`.
- Produces: `escapeXml(s: string): string`; `bannerSvg(fontCss: string): string`; `experienceSvg(fontCss: string): string`; `nmapSvg(fontCss: string): string`; `buttonSvg(label: string, fontCss: string): string`; `BUTTONS: { file: string; label: string; href: string }[]`; `readmeMarkdown(): string`; `embeddedFontCss(text: string): Promise<string>`.

- [ ] **Step 1: Write failing tests**

`scripts/readme/svg.test.ts`:

```ts
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
```

Run: `npx vitest run scripts/readme`
Expected: FAIL, cannot resolve `./svg`.

- [ ] **Step 2: Implement the builders**

`scripts/readme/svg.ts`:

```ts
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
  const w = Math.ceil(text.length * CH) + CH
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

export function bannerSvg(fontCss: string) {
  const W = 1200
  const H = 360
  const name = ASCII_NAME.split('\n')
    .map((row, i) => `<tspan x="28" dy="${i === 0 ? 0 : 15.5}">${escapeXml(row)}</tspan>`)
    .join('')
  const body = `<rect x="8" y="8" width="${W - 16}" height="40" fill="none" stroke="${C.fg}" stroke-width="1.5"/>
<text x="24" y="34">[0]  ${escapeXml(`${identity.handle}: ~`)}</text>
<text x="${W / 2}" y="34" text-anchor="middle">${escapeXml(identity.certsShort.join(' | '))}</text>
<text x="${W - 24}" y="34" text-anchor="end" class="dim">jasonsonith.github.io</text>
${typed('t0', 28, 92, `${PROMPT} whoami`, 0.2, 4)}
<text y="126" style="font-size:11px">${name}</text>
${typed('t1', 28, 230, identity.roles[0], 1.3, 4)}
${typed('t2', 28, 256, identity.roles[1], 1.8, 4)}
${typed('t3', 28, 310, `${PROMPT} ./contact.sh`, 2.4, 4)}
${cursor(28 + (PROMPT.length + 14) * CH, 310)}
${rain(W - 52, 60, H - 76)}`
  return svg(W, H, `Terminal banner: ${identity.name}, ${identity.roles.join(', ')}`, fontCss, body)
}

function panel(title: string, command: string, lines: { text: string; dim?: boolean }[], fontCss: string) {
  const W = 590
  const H = 70 + Math.max(lines.length, 7) * LH
  const body = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${C.dim}" stroke-width="1.5"/>
<text x="20" y="36"><tspan class="dim">${escapeXml(PROMPT)} </tspan>${escapeXml(command)}</text>
${lines.map((l, i) => `<text x="20" y="${76 + i * LH}"${l.dim ? ' class="dim"' : ''}>${escapeXml(l.text)}</text>`).join('\n')}`
  return svg(W, H, title, fontCss, body)
}

const pad = (s: string, width: number) => s.padEnd(width)

export function experienceSvg(fontCss: string) {
  const lines = experience.flatMap((e) => [
    { text: `${pad(e.periodShort, 12)}${e.orgShort}` },
    { text: `${' '.repeat(12)}${e.role}`, dim: true },
  ])
  const title = `experience.log: ${experience.map((e) => `${e.role} at ${e.org} (${e.period})`).join('; ')}`
  return panel(title, 'cat experience.log', lines, fontCss)
}

export function nmapSvg(fontCss: string) {
  const lines = [
    { text: `${pad('PORT', 10)}${pad('STATE', 7)}SERVICE`, dim: true },
    ...services.map((s) => ({ text: `${pad(s.port, 10)}${pad('open', 7)}${s.service}` })),
  ]
  return panel(`nmap scan of tools: ${services.map((s) => s.service).join(', ')}`, 'nmap -sV jason', lines, fontCss)
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

  return `<!-- Generated by jasonsonith.github.io/scripts/readme. Edit src/data/profile.ts, then run npm run readme. -->
<p align="center">
  <img src="assets/banner.svg" alt="Terminal: whoami prints ${escapeXml(identity.name)}. ${escapeXml(identity.roles.join('. '))}." width="100%">
</p>

<p align="center">
${buttons}
</p>

<p align="center">
  <img src="assets/experience.svg" alt="cat experience.log: ${escapeXml(experience.map((e) => `${e.role}, ${e.org}`).join('; '))}" width="49%">
  <img src="assets/nmap.svg" alt="nmap -sV jason: ${escapeXml(services.map((s) => s.service).join(', '))}" width="49%">
</p>

### \`cat experience.log --verbose\`

${exp}

### \`ls -la ~/projects\`

| project | what | stack |
|---|---|---|
${projectRows}

### \`cat certs.txt\`

${[...certs, ...awards].map((c) => `- ${c}`).join('\n')}

### \`cat education.txt\`

${edu}

### \`history | grep leadership\`

${lead}
`
}
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run scripts/readme`
Expected: PASS.

- [ ] **Step 4: Font embedding**

`subset-font` ships no types; add `scripts/readme/subset-font.d.ts`:

```ts
declare module 'subset-font' {
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: { targetFormat?: 'woff2' | 'woff' | 'sfnt' },
  ): Promise<Buffer>
}
```

`scripts/readme/font.ts`:

```ts
import { readFileSync } from 'node:fs'
import subsetFont from 'subset-font'

const DIR = 'node_modules/@fontsource/google-sans-code/files'
const FACES = [
  { file: 'google-sans-code-latin-400-normal.woff2', range: 'U+0000-00FF,U+2000-206F' },
  { file: 'google-sans-code-symbols2-400-normal.woff2', range: 'U+2500-259F' },
]

export async function embeddedFontCss(text: string) {
  const css = await Promise.all(
    FACES.map(async ({ file, range }) => {
      const font = await subsetFont(readFileSync(`${DIR}/${file}`), text, { targetFormat: 'woff2' })
      return `@font-face{font-family:'Google Sans Code';src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');unicode-range:${range}}`
    }),
  )
  return css.join('')
}
```

- [ ] **Step 5: Generator entry point**

`scripts/readme/generate.ts`:

```ts
import { mkdirSync, writeFileSync } from 'node:fs'
import { embeddedFontCss } from './font'
import { BUTTONS, bannerSvg, buttonSvg, experienceSvg, nmapSvg, readmeMarkdown } from './svg'

const OUT = 'readme-out'
mkdirSync(`${OUT}/assets`, { recursive: true })

const builds: [string, (css: string) => string][] = [
  ['banner.svg', bannerSvg],
  ['experience.svg', experienceSvg],
  ['nmap.svg', nmapSvg],
  ...BUTTONS.map((b): [string, (css: string) => string] => [b.file, (css) => buttonSvg(b.label, css)]),
]

for (const [file, build] of builds) {
  const css = await embeddedFontCss(build(''))
  writeFileSync(`${OUT}/assets/${file}`, build(css))
  console.log(`wrote ${OUT}/assets/${file}`)
}
writeFileSync(`${OUT}/README.md`, readmeMarkdown())
console.log(`wrote ${OUT}/README.md`)
```

Run: `npm run readme && ls -l readme-out/assets`
Expected: seven SVGs, each under 60 KB, and `readme-out/README.md`.

- [ ] **Step 6: Render the README the way GitHub shows images**

GitHub serves README SVGs through `<img>`: no scripts, no external fonts; embedded fonts and SMIL animation work. `scripts/readme-preview.mjs`:

```js
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const md = readFileSync('readme-out/README.md', 'utf8')
const body = md.replace(/src="assets\//g, `src="file://${process.cwd()}/readme-out/assets/`)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1012, height: 1400 } })
await page.setContent(`<body style="background:#0d1117;margin:0;padding:24px;color:#e6edf3;font-family:sans-serif">${body}</body>`)
await page.waitForTimeout(4500)
await page.screenshot({ path: '.impeccable/review/readme-github.png', fullPage: true })
await browser.close()
console.log('captured .impeccable/review/readme-github.png')
```

Run: `node scripts/readme-preview.mjs`. Open the PNG: the font is Google Sans Code (not a fallback), block letters align in columns, nothing is clipped, typed lines are complete after the animation. Fix coordinates in `svg.ts` and repeat once.

- [ ] **Step 7: Guard and commit**

```bash
npm test
git add scripts && git commit -m "feat: generate animated terminal profile README"
```

Expected: all tests pass, including `no-phone` scanning `readme-out/`.

---

### Task 10: Deploy [SIMPLE]

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md` (replace the Vite scaffold README)

- [ ] **Step 1: Workflow and repo README**

`.github/workflows/deploy.yml`:

```yaml
name: deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`README.md`:

```markdown
# jasonsonith.github.io

Source for [jasonsonith.github.io](https://jasonsonith.github.io): a terminal-style portfolio built with Vite, React, Tailwind, and shadcn/ui.

- `npm run dev` to develop, `npm test` to run checks
- `npm run readme` regenerates the GitHub profile README into `readme-out/`
- All content lives in `src/data/profile.ts`
```

```bash
git add -A && git commit -m "ci: deploy site to GitHub Pages"
```

- [ ] **Step 2: Checkpoint with the user (required)**

Show `.impeccable/review/desktop.png`, `mobile.png`, and `readme-github.png`, and list what will be published: new public repo `JasonSonith/jasonsonith.github.io` (this project, including `.impeccable/` mockups, docs, and `public/resume.pdf`), and a replaced `README.md` plus `assets/` in `JasonSonith/JasonSonith`. Wait for an explicit go-ahead.

- [ ] **Step 3: Create the repo, push, enable Pages**

If the GitHub MCP is connected, create the repository with its `create_repository` tool (name `jasonsonith.github.io`, public, description "Terminal-style portfolio"). Otherwise:

```bash
. ~/.github_token.env
curl -sf -X POST -H "Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d '{"name":"jasonsonith.github.io","description":"Terminal-style portfolio","homepage":"https://jasonsonith.github.io","has_wiki":false}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['html_url'])"
```

Push with the token passed through an inline credential helper:

```bash
. ~/.github_token.env
git remote add origin https://github.com/JasonSonith/jasonsonith.github.io.git
git -c credential.helper='!f() { echo username=x-access-token; echo "password=$GITHUB_PERSONAL_ACCESS_TOKEN"; }; f' push -u origin main
```

Enable Pages for Actions and dispatch the workflow:

```bash
curl -s -X POST -H "Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/JasonSonith/jasonsonith.github.io/pages -d '{"build_type":"workflow"}'
curl -s -X POST -H "Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/JasonSonith/jasonsonith.github.io/actions/workflows/deploy.yml/dispatches -d '{"ref":"main"}'
```

If the Pages call errors, ask the user to set Settings > Pages > Source to "GitHub Actions" once, then dispatch again.

- [ ] **Step 4: Verify the live site**

```bash
curl -s -H "Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN" "https://api.github.com/repos/JasonSonith/jasonsonith.github.io/actions/runs?per_page=1" \
  | python3 -c "import sys,json; r=json.load(sys.stdin)['workflow_runs'][0]; print(r['status'], r['conclusion'])"
curl -sI https://jasonsonith.github.io/ | head -1
curl -sI https://jasonsonith.github.io/resume.pdf | head -1
```

Expected: `completed success`, then `HTTP/2 200` for both. Run `CAPTURE_URL=https://jasonsonith.github.io/ node scripts/smoke.mjs`; expected `smoke ok`.

- [ ] **Step 5: Publish the profile README**

```bash
S=/tmp/claude-1000/-home-sonit/20a5c647-28e8-4de1-8901-06850fd802f6/scratchpad/profile-repo
rm -rf "$S" && git clone https://github.com/JasonSonith/JasonSonith.git "$S"
cp readme-out/README.md "$S/README.md" && mkdir -p "$S/assets" && cp readme-out/assets/*.svg "$S/assets/"
git -C "$S" add -A && git -C "$S" commit -m "feat: terminal-style profile README"
git -C "$S" -c credential.helper='!f() { echo username=x-access-token; echo "password=$GITHUB_PERSONAL_ACCESS_TOKEN"; }; f' push origin HEAD
```

Capture the live profile (`CAPTURE_URL` is not used here):

```bash
node -e "
import('playwright').then(async ({ chromium }) => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('https://github.com/JasonSonith', { waitUntil: 'networkidle' }); await p.waitForTimeout(5000);
  await p.screenshot({ path: '.impeccable/review/profile-live.png', fullPage: true }); await b.close();
})"
```

Open it: SVGs render with the embedded font; links resolve.

---

### Task 11: Finish review, code review, documentation [COMPLEX]

- [ ] **Step 1: Mechanical detector**

```bash
$I detect --json src/ index.html > .impeccable/review/detect.json
```

Read the findings; fix mechanical ones, rebuild, re-capture `hero` and `responsive` once.

- [ ] **Step 2: Final comp diff**

```bash
$I comp-diff --comp .impeccable/mocks/terminal-tmux.png --build .impeccable/review/desktop.png --spec .impeccable/build/spec.json --out-dir .impeccable/review/diff/final
```

- [ ] **Step 3: Impeccable finish reviewer (fresh context)**

The impeccable plugin's agents are not registered in this harness. Spawn a fresh `general-purpose` subagent (no conversation history) instructed to read and follow `/home/sonit/.claude/plugins/marketplaces/impeccable/plugin/agents/impeccable-finish-reviewer.md`, with inputs: the original request (a green terminal GitHub landing page and portfolio built from the resume with impeccable and shadcn), the spec path, `PRODUCT.md`, approved comp `.impeccable/mocks/terminal-tmux.png`, screenshots `.impeccable/review/{hero-repro,desktop,mobile,user-1280,readme-github}.png` (all required), `.impeccable/build/state.json`, `.impeccable/build/spec.json`, diff dirs `.impeccable/review/diff/hero/` and `.impeccable/review/diff/final/`, `.impeccable/review/detect.json`, and the craft floor `/home/sonit/.claude/plugins/marketplaces/impeccable/plugin/skills/impeccable/reference/craft-floor.md`. Disclose the substitution to the user. Act on its disposition word (recapture, rebuild, fix, ship) per `reference/new-work.md` section 7, at most two rounds.

- [ ] **Step 4: Dual code review on the final diff (CLAUDE.md, COMPLEX)**

```bash
git diff $(git rev-list --max-parents=0 HEAD) HEAD -- . ':!public/resume.pdf' ':!.impeccable' ':!package-lock.json' > /tmp/claude-1000/-home-sonit/20a5c647-28e8-4de1-8901-06850fd802f6/scratchpad/final.diff
```

In one message spawn two fresh-context reviewers, each given only the diff path, the spec path, `PRODUCT.md`, and this plan's Global Constraints, told to treat the author's claims as unverified and cite file:line:
1. Opus: `ecc:code-reviewer` subagent. Focus: correctness, accessibility, effect cleanup, phone leakage, link `rel`, token handling in commands and scripts.
2. GPT: `codex:codex-rescue` subagent, same brief, adversarial.

Apply Critical and Important fixes, re-review only those, then `npm run build && npm test && node scripts/smoke.mjs`.

- [ ] **Step 5: Documenter**

Spawn a fresh `general-purpose` subagent instructed to follow `/home/sonit/.claude/plugins/marketplaces/impeccable/plugin/agents/impeccable-documenter.md` with the project root, artifact path `src/`, the spec, `PRODUCT.md`, and `/home/sonit/.claude/plugins/marketplaces/impeccable/plugin/skills/impeccable/reference/document.md`; write boundary `DESIGN.md` and `.impeccable/design.json`. Verify both exist and carry tokens.

```bash
$I build-phase finish --disposition ship
git add -A && git commit -m "docs: add DESIGN.md and finish review"
. ~/.github_token.env && git -c credential.helper='!f() { echo username=x-access-token; echo "password=$GITHUB_PERSONAL_ACCESS_TOKEN"; }; f' push
```

If review fixes changed profile data or the README builders, re-run `npm run readme` and repeat Task 10 Step 5.

- [ ] **Step 6: Hand-off**

Report: live URLs, screenshots, review dispositions at their real scope, anything left open, and two offers: update the GitHub bio/company (token has `user` scope), and rotate the pasted token.
