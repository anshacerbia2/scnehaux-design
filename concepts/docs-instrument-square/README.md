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

## Reveal (`square.js`)

Content rises into place as it first enters the view: from 28px below and an 8px
blur to rest, 900ms, `power3.out`, in document order 80ms apart. The finest blocks
rise (a heading, a paragraph, a card's parts), never a cell on its own, since a
fading cell would show the grid's line colour through it. A 3D drawing (the landing
assembly) rises without the blur, which would flatten it. The page is held hidden
until the blocks are marked, so nothing shows and then jumps. Reduced motion,
`?render` and no JS show everything at once.

## Smooth scroll (`square.js`)

A mouse-wheel notch is eased toward its target (Lenis-style, no library, a 120ms
time constant, close to the reference's `lerp: 0.12`). A trackpad keeps native
scrolling: its own inertia is already smooth and runs off the main thread. An
element that can still scroll that way keeps the wheel (the Button sidebar, code
blocks); ctrl or pinch zoom, horizontal swipes, keys, anchors and find are never
intercepted, and reduced motion turns it off.

The ruler and its titles are redrawn in the same frame the glide moves the page,
never a frame behind it: a frame late reads as the ruler dragging behind the page.
Nothing reads layout while scrolling: section positions are measured on resize and
cached, the scale moves as one transform at rest, and a style is written only when
it changes. `instrument.js` writes its per-frame values (read-head energy and focus)
on the read head instead of the root, so scrolling no longer restyles the whole
document: style recalculation while scrolling Landing fell from about 1.6s to 31ms
over 2.3s of native scrolling (Chromium, CDP metrics).

## The ruler scrollbar (`square.js`)

The native scrollbar is hidden at 1024px and wider; a 60px ruler on the right edge
takes its place.

- **At rest** the ruler reads at page scale (one tick per 1% of the page, a number
  every 5) around a blue *now* line that reads like a receipt: `05 · 042%`, the
  section and the position.
- **The ledger.** Each section's start is marked on the scale. A section read to its
  end is verified: its mark turns blue and a check is drawn beside it. The one being
  read is ink; the rest are faint.
- **Titles.** Sections already read are stacked small at the top right, the current
  one large under them, the next one stands upright on the ruler where it begins,
  and the rest wait at the bottom right. Each title is a link to its section.
- **Change, with the scroll.** Titles move as the page moves, letter by letter, the
  last letter first. The next title climbs out of the stack and stands on the ruler,
  hanging from its section's line on the page, as that line comes into view. It
  stays there until the blue now line, which slides down the viewport as the page
  scrolls, meets that line; only then do its letters fly up to the large place and
  the previous title drops into the read stack. Each move runs over 30% of a screen
  of travel (less where sections are close) and is a function of the scroll
  position, so scrolling back plays it back. The ruler's section marks sit where
  each section's line sits in the document, so scale and page agree. Once the current title is whole, a blue
  check is drawn beside it.
- **Verified on demand.** Hovering or focusing a title at rest (the current one or
  either stack) verifies it again: its letters read as hash characters (`0–9 A–F`)
  for 120ms, then resolve left to right, one every 45ms; the current title's check
  is drawn again after. Once per entry, never on a title in motion or with the ruler
  folded, and not under reduced motion. Scrolling moves the letters; only a hover
  shuffles them.
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
  (line, node, glass, column, padding) are expression-local guidance.
- `square.js`: smooth scroll, the ruler scrollbar, its ledger and titles. No
  dependencies.
- `<Board>.html`: the Instrument page laid out as cells (section bars, `sq-cells`
  grids, `sq-facts` rows). Content is otherwise Instrument's; keep the two in step
  when a board changes. They still run `../docs-instrument/instrument.js`.
- `<Board>.png`: the still frame, dark, 1440px wide, rendered with
  `?render&mode=dark`. `<Board>.thumb.webp`: the live first screen, dark, so the
  hub card shows the ruler.

Query parameters are Instrument's: `?mode=light|dark`, `?render`.
