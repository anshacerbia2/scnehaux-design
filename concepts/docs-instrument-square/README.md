# Docs · Instrument · Square

The Instrument boards (`concepts/docs-instrument/`) drawn as one continuous line
drawing. Content, colour roles and Instrument's motion (drawing, typing, counters,
"here") are kept; the geometry, the lines and the scrollbar change.

> **Status: reference, non-normative (ADR-UIP-VIS-002).** Square geometry departs
> from the brand book's concentric ladder (R24 panel, pad 8, R16 container), and the
> ruler labels use Archivo Expanded and the HUD text Geist Mono instead of the system
> mono. It is an option to compare, not a rule; adopting it needs an ADR-UIP-VIS-001
> revision.

| Board | Page | Image |
| :-- | :-- | :-- |
| Public · Landing (global) | [`Docs-Landing.html`](Docs-Landing.html) | [`Docs-Landing.png`](Docs-Landing.png) |
| Signed in · Workspace home | [`Docs-Home.html`](Docs-Home.html) | [`Docs-Home.png`](Docs-Home.png) |
| Docs · Components / Button | [`Docs-Button.html`](Docs-Button.html) | [`Docs-Button.png`](Docs-Button.png) |

## The drawing

1. **One line, never a box in a box.** The page is a centre column bounded by two
   hairlines. Content is laid out as cells that share their dividers (the line
   shows through a 1px grid gap), so a panel never sits inside another frame.
2. **The crossing rule.** Every section opens with a 1px rule across the whole
   viewport, drawn in from the left once, with a bold 11px cross where it meets
   each side of the column. On the Button page the rule spans the page column
   between the sidebar and the contents, and the crosses sit on those dividers.
3. **Section bars.** `02 / Name ········ facts`: number, name and the section's
   title-block facts in the HUD voice (mono, tracked, upper case). The bar holds
   under the nav while its section is read; the number turns blue when it is "here".
   The crossing rule sits above the bar, so it is the bar's top line until the bar
   meets the nav; by then the rule has scrolled under the nav and the nav's line
   takes over, so the two never double.
4. **No radius.** Every radius token (`radius.mark` … `radius.pill`) resolves to 0
   and literal radii are flattened. Components still bind the tokens. The Button
   *Anatomy* view reads `R0 · radius.control`.
5. **No read head, no reticle, no left rail.** The ruler scrollbar replaces them.
6. **Nav and calls to action** are cells of the same lines: a full-width 48px strip,
   mono upper-case labels, the current page as an ink chip, the primary action as
   a solid ink cell. Calls to action outside a specimen share the 48px height.

## Smooth scroll (`square.js`)

The wheel is eased toward its target (Lenis-style, no library: about 150ms time
constant). An element that can still scroll that way keeps the wheel (the Button
sidebar, code blocks); ctrl or pinch zoom, horizontal swipes, keys, anchors and
find are never intercepted, and reduced motion turns it off.

## The ruler scrollbar (`square.js`)

The native scrollbar is hidden at 1024px and wider; a 60px ruler on the right edge
takes its place.

- **At rest** the ruler reads at page scale (one tick per 1% of the page, a number
  every 5) around a blue *now* line that shows the position as `042%`.
- **Titles.** Sections already read are stacked small at the top right, the current
  one large under them, the next one stands upright on the ruler where it begins,
  and the rest wait at the bottom right. Each title is a link to its section.
- **Change.** When the current section changes, every title re-forms letter by
  letter: each letter flies, turns and scales to its new place after a short stagger.
- **Titles never cover the page at rest.** The large title shrinks to the free
  margin between the column and the ruler. Where even the small titles do not fit
  (about 1440px and below), the current title stands upright at the head of the
  ruler, the next one where it begins, and the others wait until the ruler folds.
- **Hover.** The ruler folds the whole page into 0–100 over the viewport, draws the
  visible part as a window, marks the pointer with a 3px ink line, and every title
  moves to the point where its section begins. Click to jump, drag to scrub.
- **Keyboard.** The ruler is focusable and folds on focus. Arrows step 1% (shift 5%),
  Page Up and Page Down move by section, Home and End go to the ends. It reports
  its value as "42%, Guarantees".
- The ruler, titles and the corner glass behind them are viewport furniture: they
  are left out of `?render`, without JS, below 1024px, and under reduced motion
  every change lands at once.

## Files

- `square.css`: the line system, the nav, the section bars, the cells and the ruler
  styles, loaded after `../docs-instrument/instrument.css`. The `--sq-*` properties
  (line, cross, glass, column, padding) are expression-local guidance.
- `square.js`: the ruler scrollbar and its titles. One rAF loop, no dependencies.
- `<Board>.html`: the Instrument page laid out as cells (section bars, `sq-cells`
  grids, `sq-facts` rows). Content is otherwise Instrument's; keep the two in step
  when a board changes. They still run `../docs-instrument/instrument.js`.
- `<Board>.png`: the still frame, dark, 1440px wide, rendered with
  `?render&mode=dark`. `<Board>.thumb.webp`: the live first screen, dark, so the
  hub card shows the ruler.

Query parameters are Instrument's: `?mode=light|dark`, `?render`.
