# Docs · Instrument · Square

The Instrument boards (`concepts/docs-instrument/`) drawn as one continuous line
drawing. Content, colour roles and Instrument's motion (drawing, typing, counters,
"here") are kept; the geometry, the lines and the scrollbar change.

> **Status: reference, non-normative (ADR-UIP-VIS-002).** Square geometry departs
> from the brand book's concentric ladder (R24 panel, pad 8, R16 container), and the
> HUD text uses IBM Plex Mono instead of the system mono (the ruler titles are Inter,
> the brand face). It is an option to compare, not a rule; adopting it needs an
> ADR-UIP-VIS-001 revision.
>
> The ruler scrollbar began from a reference site's page-position ruler. What makes
> it Scnehaux's own is the evidence vocabulary: the ledger marks that verify each
> section read, titles verified from hash characters, the receipt readout, and the
> brand faces, Inter and a plain mono.
>
> The reveal moves content 28px, past Instrument's 4px rise; that too is guidance.

| Board | Page | Image |
| :-- | :-- | :-- |
| Public · Landing (global) | [`Docs-Landing.html`](Docs-Landing.html) | [`Docs-Landing.png`](Docs-Landing.png) |
| Signed in · Workspace home | [`Docs-Home.html`](Docs-Home.html) | [`Docs-Home.png`](Docs-Home.png) |
| Docs · Components / Button | [`Docs-Button.html`](Docs-Button.html) | [`Docs-Button.png`](Docs-Button.png) |

## The drawing

1. **One line, never a box in a box.** The page is a centre column bounded by two
   hairlines. Content is laid out as cells that share their dividers (the line
   shows through a 1px grid gap), so a panel never sits inside another frame.
2. **The crossing rule and its crosses.** Every section opens with a 1px rule across
   the whole viewport, drawn in from the left once, with a strong 11px cross where
   it meets each side of the column. On the Button page the rule spans the page
   column between the sidebar and the contents, and the crosses sit on those
   dividers.
3. **Section bars.** `02 / Name ········ facts`: number, name and the section's
   title-block facts in the HUD voice (mono, tracked, upper case). The bar holds
   under the nav while its section is read; the number turns blue when it is "here".
   The crossing rule sits above the bar, so it is the bar's top line until the bar
   meets the nav; by then the rule has scrolled under the nav and the nav's line
   takes over. When the next section pushes a held bar up, the bar's -1px bottom
   margin lands its line on the next rule. The lines never double.
4. **No radius.** Every radius token (`radius.mark` … `radius.pill`) resolves to 0
   and literal radii are flattened. Components still bind the tokens. The Button
   *Anatomy* view reads `R0 · radius.control`.
5. **No read head, no reticle, no left rail.** The ruler scrollbar replaces them.
6. **Nav and calls to action** are cells of the same lines: a full-width 48px strip,
   mono upper-case labels, the current page as an ink chip, the primary action as
   a solid ink cell. Calls to action outside a specimen share the 48px height.
   Hovering or focusing a nav link or a call to action verifies its label like a
   ruler title: hash characters for 120ms, then it resolves left to right, one
   character every 45ms. Only the text changes; the icon stays put, the mono face
   keeps the width, and the accessible name stays the real label. Component specimens
   (the Button page's stage, the guarantees' Save and Cancel) are left alone.

## Scroll behaviour

**[`SCROLL.md`](SCROLL.md) lists every scroll behaviour in full, with its values.**
In short:

- **Reveal.** Content rises 28px out of an 8px blur as it first enters the view
  (900ms, `power3.out`, 80ms apart).
- **Smooth scroll.** Every wheel input, mouse or trackpad, glides (120ms time
  constant, Lenis-style, no library).
- **One "here".** A section is current once its line reaches the nav: ruler, section
  bar, nav readout and contents switch together.
- **The ruler scrollbar.** From 1024px up, it replaces the native scrollbar: page
  scale at rest, a blue now line with a receipt readout (`05 · 042%`), and a ledger
  that verifies each section read.
- **Section titles.** They follow their section's line, letter by letter, last
  letter first. A title stands up on the ruler as the line enters the viewport, and
  lies down into the current place as the line nears the nav. A hover verifies a
  title at rest again (hash characters, then left to right).
- **Fold.** On hover, focus or drag, the ruler folds the page into 0–100. Click
  jumps, drag scrubs, and keys step.
- **Off where it should be.** The ruler is off below 1024px; reveal and glide are off
  under reduced motion; all of it is off in `?render` and without JS.

## Files

- `square.css`: the line system, the nav, the section bars, the cells and the ruler
  styles, loaded after `../docs-instrument/instrument.css`. The `--sq-*` properties
  (line, cross, glass, column, padding) are expression-local guidance.
- `square.js`: reveal, smooth scroll, the ruler scrollbar, its ledger and titles. No
  dependencies.
- `SCROLL.md`: every scroll behaviour, with its values and where it is off.
- `<Board>.html`: the Instrument page laid out as cells (section bars, `sq-cells`
  grids, `sq-facts` rows). Content is otherwise Instrument's; keep the two in step
  when a board changes. They still run `../docs-instrument/instrument.js`.
- `<Board>.png`: the still frame, dark, 1440px wide, rendered with
  `?render&mode=dark`. `<Board>.thumb.webp`: the live first screen, dark, so the
  hub card shows the ruler.

Query parameters are Instrument's: `?mode=light|dark`, `?render`.
