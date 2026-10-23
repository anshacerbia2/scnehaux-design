# Docs · Instrument

The industrial expression of the three docs boards (public landing, signed-in
workspace, component page). Same content and the same Scnehaux UI rules as
`concepts/docs-site/`; what changes is the drawing layer on top of them, the
scroll motion and the lines.

> **Status: reference, non-normative (ADR-UIP-VIS-002).** Nothing here changes a
> rule of the brand book. The expression-local values (`--ix-*`) and the motion
> rules below are **guidance** until an ADR-UIP-VIS-001 revision records them.

| Board | Page | Image |
| :-- | :-- | :-- |
| Public · Landing (global) | [`Docs-Landing.html`](Docs-Landing.html) | [`Docs-Landing.png`](Docs-Landing.png) |
| Signed in · Workspace home | [`Docs-Home.html`](Docs-Home.html) | [`Docs-Home.png`](Docs-Home.png) |
| Docs · Components / Button | [`Docs-Button.html`](Docs-Button.html) | [`Docs-Button.png`](Docs-Button.png) |

## Why it is not a copy of anyone's look

The reference for the brief was a dark, editorial product site with numbered
sections and a marquee. None of its devices are reused. Every device here comes
from Scnehaux's own vocabulary: *verify, evidence, receipts, the concentric
ladder, the stage, blue means "here"*. The metaphor is a **calibrated technical
drawing**: the system is drawn, measured and signed off, sheet by sheet.

## The signatures

1. **The reticle.** The stage's 22px dot grid is held still (fixed to the
   viewport) and the work scrolls under it, like a part under a measuring glass.
   It is the stage of the brand book, unchanged in pitch, colour and tokens.
2. **The read head.** A Scnx Blue hairline at a fixed reading height, snapped to
   a dot row. The dots under it light, more when you scroll faster, and lean
   toward the pointer. The sheet it crosses becomes "here": the rail mark, the
   sheet number and the nav readout turn blue. Blue keeps its single meaning.
3. **Sheets and title blocks.** Each section is a sheet of a drawing set, opened
   by a ruler (minor tick every 22px, major every 110px). Its corner carries a
   title block whose cells are facts about that section (grammar standard,
   signing authority, gate count), not decoration. The footer closes the set.
   Sheet numbers are a real sequence: the order of the document.
4. **Dimension lines and radius callouts.** Lines measure the things the brand
   is built on: frames show crop marks and an `R24 / pad 8 / R16` callout,
   the Button page's *Anatomy* view measures the live button (height, padding,
   radius, icon, gap) from the DOM, the token grammar is bracketed segment by
   segment.
5. **The receipt tape.** Instead of a logo or feature marquee, a perforated
   tape prints the evidence log of recent releases (gate, subject, hash or run).
   It pauses on hover and focus and stops under reduced motion.
6. **The assembly.** The landing hero draws one component as its four contract
   plates (primitive, component, tokens, release), exploded at rest and
   assembled as you scroll past: "one component, four contracts".

## Motion rules

- **Content still obeys the rise.** Text, controls and materials never move more
  than 4px and never scale. Only drawings move far: lines draw, plates travel,
  the signal runs down the lineage.
- **Motion answers the reader.** Scrubbed by scroll (assembly, read head,
  progress), or triggered by an action (tracing a component's lineage, the
  anatomy overlay, compiling a token state, the light and dark seam). The only
  motion that runs by itself is the receipt tape, and the one-time drawing of a
  ruler or check when it first enters view.
- **One loop.** `instrument.js` reads scroll once per animation frame and writes
  custom properties; layout is never read and written in the same frame. No
  library. Scroll-driven CSS animations are not used because their engine
  support is uneven; the JS scrub is the battle-tested pattern and the CSS stays
  declarative (`--p`, `--ix-draw`).
- **Reduced motion and no-JS show the finished drawing.** Every line drawn,
  every check settled, every terminal line printed, the tape static and
  scrollable. `?render` produces the same still frame for the PNGs.

## Values (expression-local, guidance)

| Property | Value | Use |
| :-- | :-- | :-- |
| `--ix-pitch` | 22px | stage pitch: dots, ruler ticks, read-head snap |
| `--ix-draw-duration` / `-easing` | 900ms, `cubic-bezier(0.65, 0, 0.35, 1)` | a line or ruler drawing in |
| `--ix-settle-duration` / `-easing` | 420ms, `cubic-bezier(0.16, 1, 0.3, 1)` | a check or mark settling |
| `--ix-signal` | `ds-color-primary-surface-solid-default` | read head, "here", current sheet |
| `--ix-line` / `--ix-line-strong` | `neutral-border-subtle` / `-default` | rulers, dimension lines, title blocks |

Colour roles are re-declared on every `[data-theme]` root, so scoped islands
(terminals in a dark root, the Button stage in the other mode) resolve their
own tokens. That is the product's own theme-root mechanism, shown working.

## Corrections against the `docs-site` boards

- The Button page binds to Scnehaux tokens and geometry (ink primary,
  28 / 36 / 44 controls, `radius.control`), not the `acme/ui` placeholder values,
  and shows Button as *Candidate*, consistent with the workspace status matrix.
- Blue is never a button fill: *Send invite* and the Do and don't example use
  ink; the brand hue drives focus, the selected tab, checked controls and links.
- Contrast figures on the brand and Button sheets are computed in the browser
  from the OKLCH token values, not typed in.

## Files

- `instrument.css`, `instrument.js`: the expression, shared by the three pages.
  They bind `design-system/themes/default/tokens.css` and reuse the real
  component classes from `design-system/components/bundle.css`.
- `<Board>.html`: hand-authored and live (no design-canvas source, because the
  motion is the deliverable and the canvas export freezes it at its first frame).
- `<Board>.png`, `<Board>.thumb.webp`: the still frame, dark mode, 1440px wide,
  rendered with `?render&mode=dark`. Regenerate them in the same pull request
  when a page changes.

Query parameters: `?mode=light|dark` sets the mode (otherwise the last choice,
then dark); `?render` renders the still frame.
