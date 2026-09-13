# Terminal Portfolio + GitHub Profile README: Design

Date: 2026-09-13
Status: awaiting user review
Product truth: `PRODUCT.md` (content source of truth, audience, constraints)
Approved comp: `.impeccable/mocks/terminal-tmux.png` (sidecar `terminal-tmux.json`, approved)

## Goal

Replace Jason Sonith's outdated GitHub presence with two surfaces in one green-terminal world:

1. A portfolio site at `https://jasonsonith.github.io` (Vite + React + Tailwind + shadcn/ui).
2. A redesigned GitHub profile README at `github.com/JasonSonith`.

Primary audience: security recruiters and hiring managers. Within the first viewport they must see focus (pentesting / product security), proof (Honeywell, IR playbook, Georgia Tech, certs), and how to reach him.

## Decisions made

| Decision | Choice |
|---|---|
| Scope | Both site and README |
| Content | Resume is source of truth, plus true extras from the old README (summa cum laude, Medical Device Validation Platform, C/WireGuard/Kali) |
| Visual world | User-pinned green terminal / matrix |
| Composition | Live tmux session (chosen over matrix-rain reveal and green-screen mainframe) |
| Stack | Vite + React + TypeScript + Tailwind + shadcn/ui, static |
| Build path | Comp-led (impeccable build phases measure against the approved comp) |
| Resume download | Public copy of the PDF with the phone number removed |
| Push access | Through the GitHub MCP server once the user reconnects it; never the pasted session cookie |

## Surface 1: Portfolio site

### First viewport (matches approved comp)

- **Tab strip (top):** `[0] jason@sonith: ~` left; `SEC+ | CySA+ | AWS CP` center; live local clock right.
- **Left pane (~62%):** `jason@sonith:~$ whoami` then the name as ASCII block-letter art (real text in a `<pre>` with an accessible label, not an image), role lines `Penetration Tester / Product Security` and `M.S. Information Security @ Georgia Tech`, then `cat experience.log` with three tabular rows (Honeywell, Mobile Health Infirmary, University of South Alabama) and a blinking block cursor.
- **Right pane (~38%):** `nmap -sV jason` with a `PORT / STATE / SERVICE` table whose services are his real tools (burp-suite, owasp-zap, metasploit, splunk, aws-guardduty, ...).
- **Matrix rain column:** one narrow canvas strip at the right edge.
- **Status bar (bottom, inverse green):** navigation `[1] contact  [2] resume.pdf  [3] github  [4] linkedin`; keys 1-4 trigger them.

### Below the fold

Each section is another command in the same session, same pane chrome:

- `ls -la ~/projects`: rows for Engineering Skills Assessment Platform, Nextcloud Security Assessment Lab, OSCP/HTB/CPTS labs, Multi-Agent AI Medical Device Validation Platform, Earthquake Prediction research, pfSense IDS/IPS lab, python-log-analyzer. Each row expands (shadcn Accordion) to details and repo link where one exists.
- `cat certs.txt`: Security+, CySA+, AWS Cloud Practitioner; School of Computing Student of the Year 2025-2026.
- `cat education.txt`: Georgia Tech M.S. InfoSec (expected May 2028); University of South Alabama B.S. CS, Cybersecurity concentration, 3.9 GPA, summa cum laude.
- `history | grep leadership`: GreyHat (TNC26 CTF), SGA Senator (hackathon, $6,000), President of Video Game Development Club.
- `./contact.sh`: email, LinkedIn, GitHub, resume download. No phone number anywhere.

### Signature interaction

- **Boot sequence:** on first load the hero commands type out once (about 1.5s total), skippable by any key or click. All text exists in the DOM from the start; `prefers-reduced-motion` shows the final state with no typing and a static rain strip.
- **Command palette:** `Ctrl+K` or `/` opens a terminal prompt built on shadcn `Command` (cmdk). Commands: `help`, `whoami`, `projects`, `certs`, `education`, `leadership`, `contact`, `resume`, `github`, `linkedin`, `clear`. Selecting one scrolls to or opens the target.

### Visual system

- Ground near-black; phosphor green primary text; dim green secondary; inverse-video green bars for tab strip, status bar, and selected rows. Faint scanlines. No gradients or glow beyond the phosphor text itself.
- One monospace family chosen by impeccable font-match against the comp.
- shadcn components (Command, Accordion, Button, Tooltip) are fully restyled into the terminal vocabulary; no stock shadcn look survives.
- Responsive: panes stack on narrow screens (left pane, then nmap pane); status bar stays pinned at the bottom; ASCII name switches to a smaller ASCII variant that fits 390px.

### Data

A single `src/data/profile.ts` holds every fact (roles, projects, certs, education, leadership, skills, links). The site and the README generator both read it.

## Surface 2: GitHub profile README

GitHub renders README Markdown only (no JS, no custom CSS), but it does render SVG images with embedded CSS animation.

- `scripts/generate-readme.ts` reads `profile.ts` and writes SVGs plus `README.md` into a build folder for the `JasonSonith/JasonSonith` repo.
- **Banner SVG:** tmux tab strip + `whoami` typing into the ASCII name + role lines, with a small animated rain column.
- **Panels:** `experience.log` SVG and `nmap -sV jason` skills SVG, same palette; the site's mono font is subset and embedded in each SVG as a base64 `@font-face` so GitHub renders it consistently.
- **Links:** real Markdown links beneath the images, styled as terminal buttons via small SVG badges wrapped in links: `[contact]`, `[resume.pdf]`, `[site]`, `[linkedin]`.
- **Projects:** Markdown table linking to public repos.
- Every SVG has meaningful alt text.

## Deploy

- **Site repo:** new `JasonSonith/jasonsonith.github.io`. Source on `main`; a GitHub Actions workflow builds with Vite and publishes to GitHub Pages.
- **Profile repo:** existing `JasonSonith/JasonSonith`; replace `README.md` and add `assets/*.svg`.
- Pushes go through the GitHub MCP. If the MCP cannot configure Pages, the user flips Pages to "GitHub Actions" in repo settings once.
- Optional, user-confirmed: update GitHub bio/company (currently "University Of South Alabama").

## Error handling and edge cases

- Clock, typing, and rain are enhancements layered on content that renders immediately; no fact waits on an animation. (No-JS rendering is out of scope for this static SPA.)
- Command palette handles unknown commands with `command not found: <x>` and a `help` hint.
- Rain canvas pauses when off-screen or when the tab is hidden.

## Testing and verification

- `tsc` typecheck and `vite build` pass.
- Vitest unit tests for the README generator (SVGs contain expected text, links present, no phone number) and for command palette routing.
- A guard test fails the build if the phone number or its digits appear in any output file.
- Impeccable phases: comp-spec, hero gate (comp-diff), responsive captures at 1440 and 390, `impeccable detect`, finish reviewer, documenter (DESIGN.md).
- Playwright screenshots at desktop and mobile for the finish review.

## Out of scope

- Blog or CTF writeups section (the command structure leaves room for it later).
- Analytics or trackers.
- Light theme.
