---
name: Jason Sonith — Terminal Portfolio
description: A live tmux session you are already logged into — phosphor-green, flat, one monospace face, no chrome beyond the terminal itself.
colors:
  ground: "#080808"
  phosphor: "#08f679"
  phosphor-dim: "#089d46"
  phosphor-faint: "#083211"
  popover: "#0b100c"
  rain-highlight: "#c8ffe0"
  scanline: "rgb(0 0 0 / 0.22)"
typography:
  display:
    fontFamily: "Google Sans Code, ui-monospace, monospace"
    fontSize: "calc(57.35vw / (103 * 0.6))"
    fontWeight: 400
    lineHeight: 1.337
  body:
    fontFamily: "Google Sans Code, ui-monospace, monospace"
    fontSize: "clamp(14px, 1.34vw, 20px)"
    fontWeight: 400
    lineHeight: 1.62
  control:
    fontFamily: "Google Sans Code, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.62
rounded:
  sm: "0rem"
  md: "0rem"
  lg: "0rem"
components:
  button-primary:
    backgroundColor: "{colors.phosphor}"
    textColor: "{colors.ground}"
    rounded: "{rounded.md}"
    height: "2rem"
    padding: "0 0.625rem"
    typography: "{typography.control}"
  button-primary-hover:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.phosphor}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.phosphor}"
    rounded: "{rounded.md}"
    height: "2rem"
    padding: "0 0.625rem"
    typography: "{typography.control}"
  button-outline-hover:
    backgroundColor: "{colors.phosphor}"
    textColor: "{colors.ground}"
  statusbar:
    backgroundColor: "{colors.phosphor}"
    textColor: "{colors.ground}"
    height: "clamp(36px, 4.7vh, 48px)"
  section-header:
    backgroundColor: "{colors.phosphor-faint}"
    textColor: "{colors.phosphor}"
    padding: "0 1ch"
    typography: "{typography.body}"
---

# Design System: Jason Sonith — Terminal Portfolio

## Overview

**Creative North Star: "The Live tmux Session"**

The site is not a page about a terminal; it is a session already open. A visitor lands mid-`whoami`, with a live clock ticking in the tab strip, a cursor blinking at the prompt, and a real `nmap` table listing the tools Jason actually uses as if they were open ports. The world is phosphor-on-black: one green (with three tonal steps of the same hue) on near-black, one monospace face for every character on the page — prose, tables, buttons, and headings alike — and zero corner radius anywhere. There is no card grid, no drop shadow, no gradient, no icon-driven affordance system; state and hierarchy are carried entirely by inverse video (foreground and background swap) and by dimming to a lower step of the same green.

The build carries this discipline into both surfaces it ships: the React site (`src/`) and the GitHub profile README, which is a set of self-contained animated SVGs (`scripts/readme/svg.ts`) reproducing the same palette, type, and terminal-typing motion inside a renderer that allows no JS and no external CSS.

**Key Characteristics:**
- One hue, four steps: ground, faint, dim, full phosphor — nothing else.
- One font family everywhere, including numerals and headings.
- Zero border-radius, no shadows, no gradients, no glow.
- Hierarchy and state read through inverse video and dimming, not size or icons.
- Motion is diegetic: a boot-in typing sequence, a blinking cursor, a falling-glyph column — all skippable and all disabled under reduced motion.

## Colors

Every color is the same green hue at a different step, plus the near-black ground it sits on. There is no secondary or tertiary accent — this is a one-accent system by design.

### Primary
- **Phosphor** (`#08f679`, `--term-fg`): the terminal's only ink color. Body text, ASCII art, table content, borders, link underlines, focus rings, and every "on" state (inverse-video fills) are this color.

### Neutral
- **Ground** (`#080808`, `--term-bg`): the page background and the text color inside every inverse-video fill (status bar, selected accordion row, hovered button).
- **Phosphor Dim** (`#089d46`, `--term-dim`): secondary/de-emphasized text — dates, dim role hints, table headers, prompt prefixes, dividers, focus-ring color source, scrollbar thumb.
- **Phosphor Faint** (`#083211`, `--term-faint`): the lowest-contrast fill, used only as a background tint (pane title bars, hover fill on unselected accordion rows) — never as text.
- **Popover** (`#0b100c`): a barely-lighter-than-ground surface reserved for the command palette dialog, so its panel reads as a distinct plane without leaving the phosphor-on-black world.

### Named Rules
**The One Hue Rule.** Every color in the system is the same green at a different lightness step (`#083211` → `#089d46` → `#08f679`), plus the near-black it sits on. Do not introduce a second hue for status, warning, or accent purposes.

**The Inverse-Video Rule.** "Selected" or "active" is never a new color — it is foreground and background swapping. The status bar, the expanded accordion row, and a hovered/focused button all go from phosphor-on-ground to ground-on-phosphor. No other selection treatment (border glow, background tint, checkmark color change) exists in the built system.

## Typography

**Display Font:** Google Sans Code (with `ui-monospace, monospace` fallback)
**Body Font:** Google Sans Code (same family — there is no separate body face)
**Character:** One monospace face carries the whole site, including the ASCII-art name, tabular data, and every UI control. Ligatures are explicitly disabled (`font-variant-ligatures: none`) so the code-font glyphs read as plain terminal characters.

### Hierarchy

This system does not use a multi-step size scale (no display/headline/title/label sizes). There are exactly two type roles, distinguished by role rather than size, plus one un-tokenized responsive exception:

- **Display** (400, `calc(57.35vw / (103 * 0.6))`, line-height 1.337): the ASCII block-letter name (`ASCII_NAME`, figlet "ANSI Shadow", one blank column per letter), rendered in a `<pre>` and scaled to the viewport so its 103-column width always fits the left pane. Real name text is present for accessibility as a visually-hidden `<h1>`.
- **Body** (400, `clamp(14px, 1.34vw, 20px)`, line-height 1.62): everything else — prose, tables, prompts, section content. Set once on `html` and inherited everywhere; hierarchy between a section title and its body is carried by the inverse-video header fill, not a size step.
- **Control** (500, `0.875rem`/`text-sm`, inherits body line-height): the one weight departure in the system — buttons and command-palette items are medium (500) where prose stays regular (400).
- *Unresolved sizing:* the mobile ASCII variant (`ASCII_NAME_STACKED`, under 768px) uses an inline `text-[3vw] leading-[1.22] tracking-[-0.06em]` in `Hero.tsx` rather than a reusable token — the only letter-spacing value in the system, and only at that one breakpoint.

### Named Rules
**The Size-Is-Not-Hierarchy Rule.** Do not add a size scale to signal importance. This system has one body size and one display size; everything else is color (dim vs. full phosphor) or inverse video.

## Layout

There is no discrete spacing scale (no `sm`/`md`/`lg` steps). Every offset is sized in a unit chosen for what it measures, and that unit choice is itself the convention to preserve:

- **`vw`/`vh`** for chrome that must track viewport proportions exactly, to stay pixel-true to the approved comp — hero pane padding (`pl-[1.72vw]`, `pt-[2.1vh]`), the tab strip and status bar's side insets (`inset-x-[0.6vw]`), and the status bar's own height token (`--statusbar-h: clamp(36px, 4.7vh, 48px)`).
- **`ch`** for anything that has to align to the monospace character grid — table column widths (`w-[14.4ch]`, `w-[24ch]`), pane content gutters (`px-[2ch]`), the accordion's `drwxr-xr-x`-style leading column, gap widths between bracketed labels.
- **`lh`** for vertical rhythm between text blocks (`mt-[3.7vh]` aside, most vertical spacing is `mt-[1lh]`, `gap-[0.25lh]`, `py-[1lh]`), so spacing scales with the root line-height rather than a fixed px step.
- **Root type scale drives everything downstream**: `html` sets `font-size: clamp(14px, 1.34vw, 20px)` and `line-height: 1.62`; every `ch`/`lh` value in every component is relative to that one root declaration.

**Hero grid:** two-pane `grid-cols-[63fr_37fr]` (~62/38 split, matching the direction contract) — a session pane (`whoami`, ASCII name, role lines, `cat experience.log` table, cursor) on the left, an `nmap -sV jason` port table on the right, divided by a single `border-l border-term` rule. A matrix-rain canvas strip sits absolutely positioned at the far right edge (`w-[5.06%]`), independent of the two-column grid.

**Below the fold:** every section (Experience, Projects, Certs, Education, Leadership, Contact) is one more command in the same session — a bordered pane with a title-bar header — stacked full-width, with the Experience section capped at `max-w-[88ch]` per the direction contract's pane gutter.

**Responsive (Tailwind `md` breakpoint, 768px, unchanged default):**
- The hero grid collapses to one column (`max-md:grid-cols-1`); the nmap pane moves below the session pane with a top border replacing the left border.
- The desktop ASCII name (`.ascii`, viewport-scaled) is replaced by the smaller two-line `ASCII_NAME_STACKED` variant (`max-md:block`, hidden desktop version becomes `max-md:hidden`).
- The matrix-rain canvas is hidden entirely on mobile (`max-md:hidden`).
- The tab strip drops its center certs column (`max-md:grid-cols-2`); the status bar drops the bracketed `[1]`–`[4]` prefixes (`max-md:hidden` on the hotkey span) and switches from an inset floating bar (`inset-x-[0.6vw] bottom-[2.2vh]`) to a full-bleed bar flush with the viewport edges (`max-md:inset-x-0 max-md:bottom-0`).
- Tables that are two-column on desktop reflow to a stacked grid on mobile (`max-md:grid max-md:grid-cols-[14ch_1fr]`) rather than scrolling horizontally.

## Elevation & Depth

Flat, by rule. There are no shadows and no tonal surface layering anywhere in the built system — every panel is a 1px phosphor or phosphor-dim border directly on the black ground, and the only depth cue at all is the command palette's overlay (`bg-black/10` with a conditional `backdrop-blur-xs` where `backdrop-filter` is supported) behind its dialog. Hierarchy between "background" and "foreground" content is conveyed by border presence/absence and by the inverse-video fills described under Colors, never by shadow or blur on content itself.

### Named Rules
**The Flat-By-Default Rule.** No box-shadow, no gradient, no glow exists anywhere in the shipped CSS or components. A border and, where selected, an inverse-video fill are the only depth and state cues this system has.

## Shapes

**The Square-Corner Rule.** `--radius: 0rem`, and every derived step (`--radius-sm` through `--radius-4xl`) is pinned to `0rem` in `src/index.css`. Every bordered surface in the built system — tab strip, panes, buttons, accordion rows, the status bar — renders with hard, square corners. Borders are always 1px, solid, in phosphor or phosphor-dim; there is no border-image, no dashed/double treatment, and no clipping/masking beyond the fixed scanline overlay (a `repeating-linear-gradient` painted at 20% black opacity across the whole viewport, `body::after`, purely a CRT-scanline texture, not a shape device).

The command palette's dialog shell (`src/components/ui/dialog.tsx`) has no radius class either; every corner in the system is square.

## Components

### Buttons
- **Shape:** square corners (`{rounded.md}` = `0rem`), 1px border, `h-8` (2rem) height, `px-2.5` padding, `text-sm font-medium` (control type).
- **Primary:** solid phosphor fill, ground text (`bg-term text-term-bg border-term`) — the button starts in the "selected" inverse state.
- **Hover/Focus:** primary inverts to ground fill, phosphor text and border (`hover:bg-term-bg hover:text-term`); focus-visible adds a phosphor ring (`focus-visible:border-ring focus-visible:ring-3`). All variants nudge down 1px on `:active`.
- **Outline:** transparent fill, phosphor border and text; hover fills solid phosphor with ground text (mirrors Primary's resting state).
- Button labels in copy are wrapped in literal brackets by the calling code (`[ send email ]`, `[ resume.pdf ]`) — bracket text is a content convention layered on top of the component, not a CSS affordance the Button itself renders.

### Cards / Containers — the Pane
- **Corner Style:** square (`0rem`), always.
- **Border:** 1px `border-term-dim`, on all four sides.
- **Header ("title bar"):** an inverse-tinted strip (`bg-term-faint`, phosphor text, `border-b border-term-dim`) reading `jason@sonith:~$ <command>` on the left and a bracketed section id (`[projects]`) on the right — this is the recurring "pane with a title bar" pattern used by every below-the-fold section (`Section.tsx`).
- **Internal Padding:** `px-[2ch] py-[1lh]` content area.
- **Shadow Strategy:** none (see Elevation & Depth).

### Accordion (Projects)
- Rows are `ls -la`-flavored: a `drwxr-xr-x` permission-string column, a date column, then the project name — all in the shared table/grid vocabulary, not a card.
- Disclosure icon is bracket text, `[+]`/`[-]`, swapped via `aria-expanded`, not an SVG chevron.
- **Selected/expanded state:** full inverse video (phosphor fill, ground text) on the trigger row — the same Inverse-Video Rule as buttons and the status bar. Unselected rows get a faint hover fill (`hover:bg-term-faint`) instead of inverting.
- Rows are separated by hairline `border-term-faint` dividers; no card elevation between items.

### Command Palette
- Built on shadcn `Command`/`cmdk` + `Dialog`, opened by `Ctrl+K` or `/`, positioned at `top-1/3` (not centered) so it reads as a terminal prompt dropping in rather than a modal.
- Input is styled as a terminal field (`InputGroup`, transparent/tinted background, no visible affordance beyond a border) with placeholder `type a command, or help`.
- Selected list item: full inverse video (`data-selected:bg-term data-selected:text-term-bg`) — again the Inverse-Video Rule.
- Empty state renders as terminal error text: `command not found: <query> (try help)`.
- The input is prefixed with a dim `$` prompt instead of a search icon, keeping the vocabulary to text (`[+]`/`[-]`, `[1]`–`[4]`, `[cert]`/`[award]`).

### Navigation — Tab Strip and Status Bar
- **Tab strip** (top): outlined chrome (`border border-term`), 3-column grid — session handle + `ctrl+k` hint (left), certs (center, hidden on mobile), live clock (right, `tabular-nums`).
- **Status bar** (bottom, pinned): full inverse video by default (phosphor fill, ground text) holding four hotkey links (`[1] contact`, `[2] resume.pdf`, `[3] github`, `[4] linkedin`); hover/focus **un-inverts** a single link back to ground-fill/phosphor-text — the only place in the system where inverse video is the *resting* state and the interaction *removes* it rather than applies it.
- Digit keys `1`–`4` are live hotkeys (bound at the window level, guarded against modifier keys and typing targets) mirroring the visible bracket numerals.

## Do's and Don'ts

### Do:
- **Do** keep every surface to one hue at one of four lightness steps (`#080808` / `#083211` / `#089d46` / `#08f679`).
- **Do** signal "selected" or "active" with a full foreground/background inverse-video swap, not a new color or a glow.
- **Do** size spacing and type in `vw`/`vh`/`ch`/`lh` relative to the root clamp, not fixed px steps.
- **Do** keep every corner square (`0rem` radius) on every bordered surface.
- **Do** render disclosure and navigation affordances as bracketed text (`[+]`/`[-]`, `[1]`–`[4]`) rather than icons.
- **Do** let content render fully in the DOM before any boot/typing animation runs, and honor `prefers-reduced-motion` by disabling `.boot`/`.cursor` animation and never starting the rain canvas's animation loop.

### Don't:
- **Don't** add gradients or glow — the only gradient in the codebase is the scanline overlay texture, not a decorative device, and it must stay that way.
- **Don't** add drop shadows, elevation, or tonal surface layering; depth is border-only.
- **Don't** round any corner, including dialogs and popovers.
- **Don't** introduce a second accent hue for status/warning/success — reuse the existing phosphor/dim/faint steps.
- **Don't** reach for icon fonts or glyph icon sets; use bracket text and prompt characters.
