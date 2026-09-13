---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["scripts/readme/svg.ts"]
---

# Surface: portfolio site (jasonsonith.github.io) and GitHub profile README

Scope: whole site `src/App.tsx` (first viewport plus command sections) and the generated profile README (`scripts/readme/`). Visitor mode: Persuade.

Audience and job: security recruiters and hiring managers deciding within seconds whether Jason is worth contacting. Action: contact (email, LinkedIn, GitHub) or open the phone-free resume. Proof: Honeywell product security testing, NIST IR playbook in a HIPAA setting, Georgia Tech M.S., Security+ / CySA+ / AWS CP, projects with repos. Constraints: facts only from PRODUCT.md; phone number never published.

Approved comp: `.impeccable/mocks/terminal-tmux.png` (sidecar approved). Memorable moment: the ASCII name typing in under `whoami`, next to an nmap scan of his real tools, with rain at the edge.

## Direction contract

THESIS: Jason's profile is a tmux session you are already logged into; it refuses the dark shadcn card-grid portfolio and the resume-template page.

OWN-WORLD: ground #080808, phosphor #08f679, dim #089d46, faint #083211; inverse-video green bars and open rows; Google Sans Code everywhere; ANSI Shadow ASCII name with one blank column per letter; flat, no radius, no gradients or glow; faint scanlines; two-column Latin-heavy rain with fading trails.

STORY: the visitor learns focus, school, certs, and three roles in one viewport, believes the work is hands-on from the tools-as-ports scan and the verbose log, and acts through the status bar, Ctrl+K, or ./contact.sh.

FIRST VIEWPORT: outline tab strip (handle, certs, live clock) at top; left 62% pane: whoami, ASCII name at ~56% width, two role lines, cat experience.log table, cursor; right 38% pane: nmap -sV jason table; rain at the far right edge; inverse status bar pinned at the bottom holding the primary action ([1] contact) and resume, github, linkedin.

FORM: the user pinned the green terminal / matrix world, overriding the roll (seed key 9fc26639, assigned direction "Access Control"; alternates "Findings Report" pick and the dark shadcn canon). Among three terminal compositions (live tmux session, matrix rain reveal, green-screen mainframe record) the user chose the live tmux session, position 1 of that list.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Stated decisions after the hero gate

- Tools shown on their real default ports (8080 burp-suite, 4444 metasploit, 8834 nessus, 8000 splunk, 51820/udp wireguard).
- Live clock replaces the comp's frozen timestamp; experience dates written as YYYY.MM-YY.MM.
- Added `cat experience.log --verbose` with resume bullets; sections left-aligned in an 88ch pane gutter.
- README banner carries the nmap pane; bottom panels are experience and certs.

## Open decisions

- Whether to update the GitHub bio and company fields (needs the user's go-ahead).
